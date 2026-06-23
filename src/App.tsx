import React, { useState } from 'react';
import { Shield, Hammer, MapPin, CheckCircle2, CloudSnow, Clock, Calendar, ShieldCheck, Sparkles, Star, ChevronRight, Phone, Landmark, AlertTriangle } from 'lucide-react';
import Header from './components/Header';
import ServiceShowcase from './components/ServiceShowcase';
import AiPlanner from './components/AiPlanner';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { ProjectCategory } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('services');

  // Interactive parameters bridging state across individual sub-modules
  const [bridgedCategory, setBridgedCategory] = useState<ProjectCategory | undefined>(undefined);
  const [bridgedDimensions, setBridgedDimensions] = useState<string | undefined>(undefined);
  const [bridgedNotes, setBridgedNotes] = useState<string | undefined>(undefined);

  // Transfer calculation parameters from sliding visual calculator over to AI Consultant
  const handleEstimateBridged = (category: ProjectCategory, dimensionsText: string) => {
    setBridgedCategory(category);
    setBridgedDimensions(dimensionsText);
    setActiveTab('cli-planner');
  };

  // Transfer finished custom AI blueprint reports over to final dispatch booking notes
  const handlePlanBridged = (category: ProjectCategory, notesSummary: string) => {
    setBridgedCategory(category);
    setBridgedNotes(notesSummary);
    setActiveTab('booking');
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950">
      
      {/* Visual Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main layout container */}
      <main className="flex-grow">
        
        {/* Dynamic Visual Hero (Displayed when on primary viewing tabs) */}
        {(activeTab === 'services' || activeTab === 'standards') && (
          <div className="relative w-full overflow-hidden bg-stone-950 text-stone-100 py-16 md:py-24 border-b border-stone-800">
            {/* Architectural structural framing vector pattern background overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-5"></div>
            
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left block: Taglines and statements */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-800 px-3 py-1 text-xs font-semibold tracking-wider text-amber-500 border border-stone-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>SERVING GREATER BUFFALO & WNY AREA</span>
                  </div>
                  
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display leading-[1.05]">
                    Heavy-Duty Standards.<br/>
                    <span className="text-amber-500 border-b-4 border-amber-500">Hometown Integrity.</span>
                  </h1>
                  
                  <p className="text-stone-400 text-sm sm:text-base max-w-lg leading-relaxed">
                    O'Connor Contracting delivers industrial-grade roofing, insulated vinyl siding, composite decks, and high-flow seamless gutter systems designed to shield Western New York family homes from severe lake-effect snow loads.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab('cli-planner')}
                      className="px-6 py-3 bg-amber-500 text-stone-950 font-display font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-amber-400 active:scale-95 transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Consult AI Assistant</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('booking')}
                      className="px-6 py-3 bg-stone-800 text-stone-200 hover:text-stone-100 font-display font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-stone-700 transition-all cursor-pointer shadow-sm border border-stone-700 inline-flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Book Online Inspection</span>
                    </button>
                  </div>
                </div>

                {/* Right block: Local trust vectors */}
                <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-6 shadow-xl">
                  <div className="border-b border-stone-800 pb-4">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block">Core Company Statset</span>
                    <h3 className="font-display text-lg font-bold">Why WNY Families Choose O'Connor</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-950/45 p-4 rounded-xl border border-stone-800/80">
                      <span className="block font-display text-3xl font-bold text-amber-500">20+</span>
                      <span className="text-[11px] text-stone-400 font-mono">Years local experience</span>
                    </div>
                    <div className="bg-stone-950/45 p-4 rounded-xl border border-stone-800/80">
                      <span className="block font-display text-3xl font-bold text-amber-500">100%</span>
                      <span className="text-[11px] text-stone-400 font-mono">Licensed & fully insured</span>
                    </div>
                    <div className="bg-stone-950/45 p-4 rounded-xl border border-stone-800/80">
                      <span className="block font-display text-3xl font-bold text-amber-500">A+</span>
                      <span className="text-[11px] text-stone-400 font-mono">BBB accredited rating</span>
                    </div>
                    <div className="bg-stone-950/45 p-4 rounded-xl border border-stone-800/80">
                      <span className="block font-display text-3xl font-bold text-amber-500">2.4k+</span>
                      <span className="text-[11px] text-stone-400 font-mono">Successful replacements</span>
                    </div>
                  </div>

                  {/* Immediate Emergency Notice */}
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <span className="block font-bold text-amber-400 uppercase tracking-wide">Extreme weather restoration</span>
                      <p className="text-stone-300 leading-normal mt-0.5">
                        Filing storm repairs? We work directly with all major insurance companies to resolve wind and tree impact adjusters smoothly.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Dynamic Section Rendering */}
        {activeTab === 'services' && (
          <ServiceShowcase onSelectEstimate={handleEstimateBridged} />
        )}

        {activeTab === 'cli-planner' && (
          <AiPlanner 
            initialCategory={bridgedCategory} 
            initialDimensions={bridgedDimensions} 
            onPlanConfirmed={handlePlanBridged} 
          />
        )}

        {activeTab === 'booking' && (
          <BookingForm 
            prefilledCategory={bridgedCategory} 
            prefilledNotes={bridgedNotes} 
            onBookingSuccessful={() => {}} 
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel />
        )}

        {/* Standards, Licensing & Safety Page */}
        {activeTab === 'standards' && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 animate-fade-in" id="standards_section_view">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-amber-600 uppercase tracking-widest text-xs font-bold font-sans">
                Our Non-Negotiable Standards
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl mt-2">
                Engineered for WNY Climate Performance
              </h2>
              <p className="mt-4 text-stone-600 text-sm leading-relaxed">
                At O'Connor Contracting, we refuse to take shortcuts. In severe freezing zones like Buffalo and Amherst, structural shortcuts translate to ice dams, warped siding, and leaking ceilings. Here is what we implement on every job site:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Standard 1 */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="h-12 w-12 rounded-xl bg-stone-900 text-amber-500 flex items-center justify-center">
                  <CloudSnow className="h-6 w-6" />
                </div>
                <h3 className="font-display font-extrabold text-stone-950 text-lg leading-snug">
                  48-Inch Post Caissons
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Local building ordinances require footings to go past the frost line. O'Connor excavates full 48-inch concrete anchors for deck posts and pillars. This prevents spring frost-heaving and keeps your structure perfectly level for life.
                </p>
              </div>

              {/* Standard 2 */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="h-12 w-12 rounded-xl bg-stone-900 text-amber-500 flex items-center justify-center">
                  <Landmark className="h-6 w-6" />
                </div>
                <h3 className="font-display font-extrabold text-stone-950 text-lg leading-snug">
                  Local Erie & Niagara Board Codes
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Every township in WNY has minor zoning variances. We handle full drafting layout and permit submittals with towns like Tonawanda and Cheektowaga. We ensure your structural updates are fully registered, safeguarding your resale value.
                </p>
              </div>

              {/* Standard 3 */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="h-12 w-12 rounded-xl bg-stone-900 text-amber-500 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-display font-extrabold text-stone-950 text-lg leading-snug">
                  Total Safety Site Management
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Before we drill a single post-hole or take down existing materials, we synchronize utility clearances with **Dig Safely New York (Call 811)**. We also set up heavy debris nets, safeguarding your property landscapes.
                </p>
              </div>

            </div>

            {/* Weather Resilience Board */}
            <div className="mt-12 bg-stone-900 text-stone-100 p-8 rounded-3xl border border-stone-800 flex flex-col lg:flex-row items-center gap-8 shadow">
              <div className="space-y-4 lg:w-2/3">
                <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-widest block">
                  CRAFTSMANSHIP COMMITMENT
                </span>
                <h3 className="font-display font-bold text-2xl tracking-tight text-white sm:text-3xl">
                  Wind Mitigation & Seamless Alignment
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                  Every shingle we hammer and every vinyl locked profile is reinforced with stainless structural ring-shank fasteners that don't rust or slip. Our material underlayments carry complete waterproof rating seals to prevent water backing up into plywood sheets during winter thaw cycles.
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-mono font-bold text-amber-500 pt-1">
                  <span>• 130 MPH Material Wind Rating</span>
                  <span>• Ring-Shank Nails</span>
                  <span>• Grace Ice & Water Shield Barrier</span>
                </div>
              </div>
              <div className="h-32 w-32 shrink-0 bg-stone-800 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner border border-stone-704 relative overflow-hidden group">
                <Hammer className="h-16 w-16 opacity-10 absolute -bottom-2 -left-2 rotate-12 transition-transform group-hover:translate-x-1" />
                <ShieldCheck className="h-16 w-16 text-amber-500 animate-pulse" />
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Visual Footer Corporate */}
      <Footer onSelectTab={setActiveTab} />

    </div>
  );
}
