import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initial historical seed bookings for O'Connor Contracting WNY
const bookings: any[] = [
  {
    id: "OCN-5812",
    name: "John Kowalski",
    email: "jkowalski@wnymail.com",
    phone: "(716) 834-2911",
    category: "Roofing",
    date: "2026-06-24",
    time: "10:00 AM - 12:00 PM",
    notes: "Lake-effect wind damage on North-East slope. Plywood sheathing inspection needed.",
    location: "Cheektowaga, NY",
    status: "Confirmed",
    timestamp: new Date(Date.now() - 3600000 * 24 * 2)
  },
  {
    id: "OCN-9024",
    name: "Sarah Jenkins",
    email: "sjenkins@gmail.com",
    phone: "(716) 632-1144",
    category: "Decks",
    date: "2026-06-25",
    time: "02:00 PM - 04:00 PM",
    notes: "Requesting composite deck design with 48-inch deep frost caissons per Buffalo municipal code.",
    location: "Amherst, NY",
    status: "In Progress",
    timestamp: new Date(Date.now() - 3600000 * 12)
  },
  {
    id: "OCN-3419",
    name: "Robert Miller",
    email: "rmiller@wnymail.com",
    phone: "(716) 401-2299",
    category: "Siding",
    date: "2026-06-26",
    time: "08:00 AM - 10:00 AM",
    notes: "Locking siding installation estimate for full residential property. Matching material colors with neighbors.",
    location: "Tonawanda, NY",
    status: "Completed",
    timestamp: new Date(Date.now() - 3600000 * 36)
  },
  {
    id: "OCN-1102",
    name: "Amanda Vance",
    email: "avance@buffalo.edu",
    phone: "(716) 555-0182",
    category: "Gutters",
    date: "2026-06-28",
    time: "12:00 PM - 02:00 PM",
    notes: "Seamless copper rain gutter assemblies with premium debris leaf guards.",
    location: "Buffalo, NY",
    status: "Confirmed",
    timestamp: new Date()
  }
];

// Traffic Analytics State
const trafficStats = {
  totalViews: 4872,
  uniqueVisitorsCount: 1543,
  pageHits: {
    home: 4210,
    planner: 512,
    bookingForm: 150
  } as Record<string, number>,
  deviceCounters: {
    Desktop: 2489,
    Mobile: 2104,
    Tablet: 279
  } as Record<string, number>,
  dailyViews: {
    "Mon": 620,
    "Tue": 740,
    "Wed": 810,
    "Thu": 690,
    "Fri": 890,
    "Sat": 540,
    "Sun": 582
  } as Record<string, number>,
  hourlyDistribution: [
    12, 8, 5, 3, 4, 15, 45, 110, 240, 310, 420, 380, 
    340, 290, 310, 405, 480, 510, 390, 280, 190, 140, 85, 40
  ] as number[],
  aiConsults: 142,
  bookingsCount: 4
};

// In-memory set for actual live IPs to accurately increment unique visitors
const trackedIps = new Set<string>();

// Middleware to track traffic
app.use((req, res, next) => {
  const url = req.url;
  
  // Skip static files, vite hot module, and internal assets
  if (
    url.includes(".") || 
    url.startsWith("/@") || 
    url.startsWith("/node_modules") || 
    url.startsWith("/src")
  ) {
    return next();
  }

  // Increment view counts
  trafficStats.totalViews++;

  // Track unique visitors
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown-ip";
  const ipStr = String(ip);
  if (!trackedIps.has(ipStr)) {
    trackedIps.add(ipStr);
    trafficStats.uniqueVisitorsCount++;
  }

  // Track page hits depending on destination
  if (url === "/" || url === "") {
    trafficStats.pageHits.home = (trafficStats.pageHits.home || 0) + 1;
  }

  // Track device type
  const userAgent = req.headers["user-agent"] || "";
  let device = "Desktop";
  if (/mobile/i.test(userAgent)) {
    device = "Mobile";
  } else if (/tablet|ipad/i.test(userAgent)) {
    device = "Tablet";
  }
  trafficStats.deviceCounters[device] = (trafficStats.deviceCounters[device] || 0) + 1;

  // Track daily views
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = days[new Date().getDay()];
  trafficStats.dailyViews[currentDay] = (trafficStats.dailyViews[currentDay] || 0) + 1;

  // Track hourly distribution
  const currentHour = new Date().getHours();
  if (currentHour >= 0 && currentHour < 24) {
    trafficStats.hourlyDistribution[currentHour]++;
  }

  next();
});

// Admin Authentication Storage
const activeTokens = new Set<string>();

// Admin Auth Middleware helper
function adminAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized access. Valid token credentials required." });
  }
  const token = authHeader.substring(7);
  if (!activeTokens.has(token)) {
    return res.status(403).json({ error: "Session expired or invalid. Please log in again." });
  }
  next();
}

// Initialize Gemini client (lazy loading if possible, but standard is also fine)
let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined. AI functionality will fallback to custom rules.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Consultation AI advice
app.post("/api/consult", async (req, res) => {
  try {
    const { category, description, budget, dimensions, location } = req.body;
    
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Fallback response if GEMINI_API_KEY is not configured
      return res.json({
        success: true,
        fallback: true,
        advice: `### 🛠️ Professional Project Concept: ${category || 'General Contracting'}

Thank you for choosing **O'Connor Contracting**. We are excited to collaborate on your construction vision!
We have processed your request details:
- **Project Category:** ${category || 'General Home Construction'}
- **Aesthetic / Scope Details:** "${description || 'Residential premium installation.'}"
- **Approximate Dimensions:** ${dimensions || 'Custom scaled standard backyard/room layout'}
- **Quality Tier & Estimated Budget:** ${budget || 'Premium Durability'}
- **Target Site Location:** ${location || 'Greater Buffalo area'}

---

### ❄️ Western New York Weather & Material Choices
In Western New York, construction materials must resist aggressive lake-effect snow, damp freeze-thaw cycles, and summer humidity:
- **Roof Sytems:** We enforce ice/water leak barriers at eaves and metal valley flashing to block ice-dams.
- **Siding Panels:** We use James Hardie autoclaved fiber-cement siding or ultra-thick premium vinyl that withstands winds up to 130mph without cracking or loosening.
- **Custom Decking:** Best to build with composite Trex boards to dodge winter splitting and yearly painting stress, mounted on deep frost-depth gravel caissons (48 inches standard for Erie county).

---

### 🏗️ Step-By-Step Project Roadmap
1. **Initial Structural Inspection**: A technician surveys of the property, pitch, or structure, checking load limits.
2. **Design Blueprint & Estimator Agreement**: Solidifying materials, exact sizing, timeline, and final contract signing.
3. **Site Safety Layout & Tear-down**: Securing barriers, waste bins, and carefully dismantling current structures.
4. **Main System Install & Weather-proofing**: Fast framing, sheathing, insulation barrier setup, and exterior finishing.
5. **Quality Inspections**: Final joint tightening, siding level checks, visual validation, and cleanup.

---

### 💰 Ballpark Cost Breakdown & Valuation
- **Core Structural Labor/Prep:** ~$4,500 – $8,500
- **Advanced Heavy-Weather Materials:** ~$5,000 – $12,000 (shingles, underlayment, sheathing, nails etc.)
- **Estimated WNY Total Range:** **$9,500 – $20,500** *(Exact scope depending on structural layout and property heights)*

---

### 📜 Local Building Permits & Structural Preparation
- **Western New York Permits:** Towns like Amherst and Tonawanda require filing for roofing licenses if modifying deck layouts, structures, or structural beams.
- **Safety Checks:** Our dispatch verifies all utility wiring using *Dig Safely New York (Call 811)* before any soil excavation begins.
- **Home Preparation:** Please clear vehicles from paths and preserve standard electrical outlet access nearby.`,
      });
    }

    const ai = getGemini();

    const systemInstruction = 
      "You are the senior AI Contractor and Estimator Advisor for O'Connor Contracting, " +
      "a premium general contracting business located in Buffalo, New York (serving Buffalo, Amherst, Cheektowaga, Tonawanda, West Seneca, Orchard Park, Clarence, and surrounding Western New York). " +
      "Your tone is professional, authoritative, warm, practical, and deeply knowledgeable about high-quality craftsmanship, building safety, and the local Climate (harsh, cold winters with heavy lake-effect snow and humid summers). " +
      "Provide a highly styled, clean Markdown breakdown analyzing the user's project request. " +
      "Structure your response with these exact header sections (and use bullet points and bold highlights to make it highly readable and visually striking):\n" +
      "### 🛠️ Professional Project Concept\n" +
      "[Briefly summarize and praise their choice, describing how O'Connor Contracting would approach the design and structure. Keep it concrete.]\n" +
      "### ❄️ Western New York Weather & Material Choices\n" +
      "[Explain the exact high-durability choices required for Buffalo's extreme climate context, like high-grade underlayer ice/water shields, composite, freeze-resistant fiber cement, or cold-resistant gutters.]\n" +
      "### 🏗️ Step-By-Step Project Roadmap\n" +
      "[Outline the structural milestones of this specific build — e.g., Site prep/Teardown, Structural framing, Installations, Final walkthrough checks.]\n" +
      "### 💰 Ballpark Cost breakdown & Valuation\n" +
      "[Offer a realistic, detailed estimation breakdown for WNY standard rates based on their budget tier, emphasizing that building physical inspections are required for exact quotes.]\n" +
      "### 📜 Local Building Permits & Structural Preparation\n" +
      "[List the WNY town permit requirements, utility markup checks (e.g., Dig Safely New York 811), and preparation steps they should take before our crew arrives.]";

    const prompt = `Project Category: ${category}
User Description of Project: ${description}
Indicated Budget & Quality Tier: ${budget}
Scale / Dimensions: ${dimensions || "Standard Residential scale"}
Client Town / Neighborhood: ${location || "Buffalo, NY"}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const advice = response.text || "No response generated by AI. Please try again.";
    
    // Increment AI Consult counters
    trafficStats.aiConsults++;
    trafficStats.pageHits.planner = (trafficStats.pageHits.planner || 0) + 1;

    res.json({ success: true, advice });

  } catch (error: any) {
    console.error("Consultation Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate dynamic advisor feedback." });
  }
});

// Book a consultation
app.post("/api/book", (req, res) => {
  const { name, email, phone, category, date, time, notes, location } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Missing required contact details (Name, Email, Phone)." });
  }

  const bookingId = "OCN-" + Math.floor(1000 + Math.random() * 9000);
  const newBooking = {
    id: bookingId,
    name,
    email,
    phone,
    category,
    date: date || new Date().toISOString().split('T')[0],
    time: time || "10:00 AM",
    notes: notes || "",
    location: location || "Greater Buffalo Area",
    status: "Confirmed",
    timestamp: new Date()
  };

  bookings.push(newBooking);

  // Increment Booking counters
  trafficStats.bookingsCount++;
  trafficStats.pageHits.bookingForm = (trafficStats.pageHits.bookingForm || 0) + 1;

  res.json({ success: true, booking: newBooking });
});

// Get current bookings
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// Admin Authentication API
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "oconnor123!";
  
  if (username === adminUser && password === adminPass) {
    const token = "TOK-" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    activeTokens.add(token);
    return res.json({ success: true, token });
  }
  return res.status(401).json({ error: "Invalid admin username or password configuration." });
});

// Admin Stats & Analytics API
app.get("/api/admin/stats", adminAuth, (req, res) => {
  res.json({
    success: true,
    bookings,
    trafficStats
  });
});

// Admin Update Booking Status API
app.post("/api/admin/booking/:id/status", adminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = bookings.find(b => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: "Booking consultation file not found." });
  }
  booking.status = status || booking.status;
  res.json({ success: true, booking });
});

// Admin Delete Booking API
app.delete("/api/admin/booking/:id", adminAuth, (req, res) => {
  const { id } = req.params;
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking consultation file not found." });
  }
  bookings.splice(index, 1);
  res.json({ success: true, message: "Booking consultation removed successfully." });
});

// Vite server integrations
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
