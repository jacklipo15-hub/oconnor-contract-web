import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2, RefreshCw, PenTool, HelpCircle, FileText, Check, ShieldCheck, MapPin, Hammer } from 'lucide-react';
import { ProjectCategory, ConsultationRequest } from '../types';

interface AiPlannerProps {
  initialCategory?: ProjectCategory;
  initialDimensions?: string;
  onPlanConfirmed: (category: ProjectCategory, details: string) => void;
}

export default function AiPlanner({ initialCategory, initialDimensions, onPlanConfirmed }: AiPlannerProps) {
  const [category, setCategory] = useState<ProjectCategory>('Roofing');
  const [description, setDescription] = useState<string>('');
  const [budget, setBudget] = useState<'Classic Premium' | 'Elite Heavy-Duty' | 'Premium Luxury'>('Elite Heavy-Duty');
  const [dimensions, setDimensions] = useState<string>('');
  const [location, setLocation] = useState<string>('Amherst, NY');
  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);
  const [otherLocation, setOtherLocation] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [planResult, setPlanResult] = useState<string | null>(null);

  // Sync initial parameters passed from calculator
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
    if (initialDimensions) {
      setDimensions(initialDimensions);
      // Generate some smart initial user description to prompt beautifully
      setDescription(`We are looking to remodel/install a professional structural ${initialCategory?.toLowerCase()} matching the scale specified. We prefer a modern look with maximum resistance to local lake-effect winter elements.`);
    }
  }, [initialCategory, initialDimensions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlanResult(null);

    const submissionLocation = location === 'Other' ? (otherLocation.trim() || 'Other Location') : location;

    try {
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          budget,
          dimensions,
          location: submissionLocation
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPlanResult(data.advice);
      } else {
        throw new Error(data.error || 'Failed to generate plan.');
      }
    } catch (err: any) {
      setError(err.message || 'Connecting with AI Estimator failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Custom high-fidelity renderer to turn raw AI markdown reports into a gorgeous webpage layout
  const renderParsedPlan = (rawMarkdown: string) => {
    const lines = rawMarkdown.split('\n');
    const sections: { title: string; content: React.ReactNode[] }[] = [];
    let currentSection: { title: string; content: React.ReactNode[] } | null = null;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0 && currentSection) {
        const items = [...listItems];
        currentSection.content.push(
          <ul key={`list-${Math.random()}`} className="space-y-2.5 my-3">
            {items.map((it, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-stone-700 text-sm leading-relaxed">
                <Check className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Parse main structural subheaders
      if (trimmed.startsWith('###')) {
        flushList();
        const headerTitle = trimmed.replace(/^###\s*([🛠️❄️🏗️💰📜]?)/, '').trim();
        
        if (currentSection) {
          sections.push(currentSection);
        }
        
        currentSection = {
          title: headerTitle,
          content: []
        };
      } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        // Parse list items
        const itemText = trimmed.replace(/^[\-\*]\s*/, '').replace(/\*\*([^*]+)\*\*/g, '$1');
        listItems.push(itemText);
      } else if (trimmed === '---') {
        flushList();
        if (currentSection) {
          currentSection.content.push(<hr key={index} className="my-5 border-stone-200" />);
        }
      } else if (trimmed) {
        flushList();
        
        // Parse bold elements
        let renderedLine: React.ReactNode = trimmed;
        if (trimmed.includes('**')) {
          const parts = trimmed.split('**');
          renderedLine = parts.map((part, i) => i % 2 !== 0 ? <strong key={i} className="text-stone-900 font-bold">{part}</strong> : part);
        }

        if (currentSection) {
          currentSection.content.push(
            <p key={index} className="text-stone-600 text-sm my-2.5 leading-relaxed">
              {renderedLine}
            </p>
          );
        }
      }
    });

    flushList();
    if (currentSection) {
      sections.push(currentSection);
    }

    if (sections.length === 0) {
      // Emergency simple raw display if no markdown structure parsed
      return <div className="text-stone-700 whitespace-pre-wrap text-sm leading-relaxed">{rawMarkdown}</div>;
    }

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 text-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
              GENERATED CUSTOM BLUEPRINT
            </span>
            <h4 className="text-lg font-display font-medium text-white">
              O'Connor Specialty Contractor Blueprint
            </h4>
            <div className="flex gap-4 text-xs text-stone-400 font-mono mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                {location}
              </span>
              <span className="bg-stone-800 px-2 py-0.5 rounded text-[10px] text-amber-400">
                {budget} Grade
              </span>
            </div>
          </div>
          
          <button
            onClick={() => onPlanConfirmed(category, `Blueprint Category: ${category} targeting ${location}. Sizing scope: ${dimensions}. Client custom notes: ${description.substring(0, 100)}...`)}
            className="rounded bg-amber-500 text-stone-950 px-5 py-2.5 font-display text-xs font-bold tracking-wider uppercase hover:bg-amber-400 active:scale-95 transition-all text-center inline-block cursor-pointer shadow"
          >
            Confirm & Secure Consultation Date
          </button>
        </div>

        {/* Layout parsed cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((sec, i) => {
            // Determine custom styles and background accents based on header titles
            const isCost = sec.title.toLowerCase().includes('cost') || sec.title.toLowerCase().includes('ballpark') || sec.title.includes('💰');
            const isWeather = sec.title.toLowerCase().includes('weather') || sec.title.toLowerCase().includes('climate') || sec.title.includes('❄️');

            return (
              <div 
                key={i} 
                className={`border rounded-2xl p-6 transition-all duration-300 hover:shadow-md ${
                  isCost 
                    ? 'bg-amber-500/5 border-amber-200/50 md:col-span-2' 
                    : isWeather 
                    ? 'bg-stone-100 border-stone-300' 
                    : 'bg-white border-stone-200'
                }`}
              >
                <h5 className="font-display font-bold text-base text-stone-900 border-b border-stone-100 pb-2.5 mb-3 flex items-center gap-2">
                  <span className="text-amber-600">{sec.title.substring(0, 2)}</span>
                  <span>{sec.title.substring(2)}</span>
                </h5>
                <div className="space-y-1">
                  {sec.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="cli-planner_view">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-amber-500 bg-stone-900 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded">
          AI-Powered Contracting Planner
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl mt-3">
          Interactive Design & Estimate Assistant
        </h2>
        <p className="mt-3 text-stone-600 text-sm max-w-2xl mx-auto">
          Map out materials, regional WNY climate-protection details, building milestones, and localized estimates. Powered by our deep industry expertise, curated directly for your exact property configuration.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-stone-100">
          
          <div className="md:col-span-4 space-y-4">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-widest block">Project Specialty</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm bg-stone-50 font-medium"
                required
              >
                <option value="Roofing">Architectural Roofing systems</option>
                <option value="Siding">Insulated Siding installation</option>
                <option value="Gutters">Seamless Rain Gutters</option>
                <option value="Decks">Trex Composite deck / Patio</option>
                <option value="Remodeling">Interior Room renovation</option>
              </select>
            </div>

            {/* Scale & Dimensions (Can copy from calculator) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-widest block flex justify-between items-center">
                <span>Scale / Sizing</span>
                <span className="text-[10px] text-stone-400 capitalize font-mono">(Sq ft or lineal ft)</span>
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. 1,800 sq ft roof coverage, flat pitch"
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm bg-stone-50"
                required
              />
            </div>

            {/* Target Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-widest block">WNY Town / Neighborhood</label>
              <select
                value={location}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocation(val);
                  if (val === 'Other') {
                    setShowOtherInput(true);
                  } else {
                    setShowOtherInput(false);
                  }
                }}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm bg-stone-50 font-medium"
                required
              >
                <option value="Amherst, NY">Amherst, NY</option>
                <option value="Cheektowaga, NY">Cheektowaga, NY</option>
                <option value="Tonawanda, NY">Tonawanda, NY</option>
                <option value="West Seneca, NY">West Seneca, NY</option>
                <option value="Orchard Park, NY">Orchard Park, NY</option>
                <option value="Clarence, NY">Clarence, NY</option>
                <option value="Buffalo, NY">Buffalo City, NY</option>
                <option value="Lancaster, NY">Lancaster, NY</option>
                <option value="Williamsville, NY">Williamsville, NY</option>
                <option value="Other">Other (WNY / Surrounding Region)</option>
              </select>
              {showOtherInput && (
                <input
                  type="text"
                  required
                  value={otherLocation}
                  onChange={(e) => setOtherLocation(e.target.value)}
                  placeholder="e.g. Hamburg, NY or Lockport, NY"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm bg-stone-50 animate-fade-in mt-1.5 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              )}
            </div>
          </div>

          <div className="md:col-span-5 space-y-4">
            {/* Project description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-widest block">Describe Your Vision / Custom Requests</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Seeking a medium gray architectural roof shingle. Need copper valley linings and a complete evaluation of existing attic venting rafters because we currently experience minor ice-dams in February."
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50 h-[116px] resize-none"
                required
              />
            </div>

            {/* Siding options */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-widest block">Quality & Core Materials Grade</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Classic Premium', 'Elite Heavy-Duty', 'Premium Luxury'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBudget(opt)}
                    className={`border rounded-lg p-2 text-center text-xs tracking-tight transition-all cursor-pointer ${
                      budget === opt
                        ? 'bg-stone-900 border-stone-900 text-white font-semibold'
                        : 'border-stone-300 hover:bg-stone-50 hover:text-stone-900 text-stone-600'
                    }`}
                  >
                    {opt.split(' ')[0]}
                    <span className="block text-[8px] uppercase font-mono mt-0.5 font-normal">
                      {opt.split(' ')[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4 pt-1">
            {/* Trust box */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5">
              <span className="flex items-center gap-1.5 text-stone-800 font-bold text-xs">
                <ShieldCheck className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                No-Obligation AI File
              </span>
              <p className="text-[11px] text-stone-500 leading-normal">
                This AI report analyzes building averages and material fits for local Erie County winters. Present this generated blueprint to our physical project technician during site visitation for double inspection efficiency.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-display font-bold py-3.5 text-xs uppercase tracking-wider transition-all duration-300 shadow cursor-pointer disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Drafting Estimates...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>Generate AI Blueprint</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* AI Response Display Area */}
        <div className="mt-8 transition-all min-h-[140px] flex items-center justify-center">
          {loading && (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
              <p className="text-sm font-semibold text-stone-800">Generating Structural Blueprint & Local Estimates...</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto font-mono leading-relaxed">
                Applying structural mathematics, weather resistance vectors, and WNY code constraints. This usually takes just a few seconds.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200/50 text-red-800 p-6 rounded-2xl w-full text-center space-y-3">
              <p className="font-semibold text-sm">Consultation Assistant Offline</p>
              <p className="text-xs text-red-600 max-w-md mx-auto">{error}</p>
              <button
                onClick={handleSubmit}
                className="mt-2 inline-flex items-center gap-1.5 bg-red-800 text-white rounded px-3 py-1.5 text-xs uppercase font-bold cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry Transmission</span>
              </button>
            </div>
          )}

          {!loading && !error && !planResult && (
            <div className="text-center py-10 max-w-md mx-auto space-y-2">
              <PenTool className="h-10 w-10 text-stone-300 mx-auto" />
              <h4 className="font-display font-bold text-stone-800 text-sm">Waiting for Project Choices</h4>
              <p className="text-xs text-stone-500 leading-normal">
                Define your project requirements or dimensions above, then click the orange button. Our model will generate a personalized architectural recommendation.
              </p>
            </div>
          )}

          {!loading && !error && planResult && (
            <div className="w-full">
              {renderParsedPlan(planResult)}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
