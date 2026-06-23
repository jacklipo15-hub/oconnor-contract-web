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

// In-memory array to store booking logs
const bookings: any[] = [];

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
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const advice = response.text || "No response generated by AI. Please try again.";
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
  res.json({ success: true, booking: newBooking });
});

// Get current bookings
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
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

export default app;
