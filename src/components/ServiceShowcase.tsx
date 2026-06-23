import React, { useState } from 'react';
import { Shield, Hammer, CloudSnow, Clock, Sparkles, Flame, CheckCircle2, ChevronRight, Calculator, Info } from 'lucide-react';
import { ProjectCategory, ServiceDetail } from '../types';

interface ServiceShowcaseProps {
  onSelectEstimate: (category: ProjectCategory, dimensionsDetails: string) => void;
}

const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'Roofing',
    title: 'Architectural Roof Systems',
    tagline: 'Lake-Effect Tough. Lifetime Shielding.',
    description: 'We install premium multi-layered shingles and robust metal roofing engineered to withstand heavy Northern lake-effect snow loads, wind gusts up to 130 mph, and severe temperature swings in Erie & Niagara counties.',
    duration: '2 to 4 Days (Full Replacement)',
    materials: [
      'CertainTeed Landmark Architectural Shingles',
      'Grace Ice & Water Shield (Eaves & Valleys)',
      'Synthetic Heavy-Duty Underlayment',
      'Stainless-Steel Ring Shank Nails'
    ],
    climateFeature: 'Double-width ice dam defense barrier system installed natively on every home.',
    image: 'https://images.unsplash.com/photo-1632759140131-1d1f0c6fcb0a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'Siding',
    title: 'Premium Vinyl & Fiber-Cement Siding',
    tagline: 'High-Density Insulation. Sharp Curb Appeal.',
    description: 'Transform and protect your exterior. We specialize in James Hardie® autoclaved fiber-cement siding and elite insulated locking vinyl panels that resist molding, freeze-cracking, and color-fading.',
    duration: '5 to 8 Days',
    materials: [
      'James Hardie® Plank HZ5 (Freeze-Thaw Resistant)',
      'Mastic Premium Vinyl Siding (Double 4" Clapboard)',
      'Tyvek HomeWrap Wind Barrier & Insulation Sleeves',
      'Color-matched aluminum coil trim casings'
    ],
    climateFeature: 'High-grade thermal wrapping that blocks bitter lake-effect drafts.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'Gutters',
    title: 'Seamless Gutter & Leaf Flow Controls',
    tagline: 'High-Capacity Flow. Prevention of Winter Ice.',
    description: 'Protect your roof fascia and house foundation. Our custom seamless 5-inch and 6-inch aluminum systems are roll-formed onsite for a custom layout match, channeling heavy rain away without sagging.',
    duration: '1 Day',
    materials: [
      'Heavy-gauge 0.032 Seamless Aluminum Gutters',
      'Hidden Screw-In Trim Hangers spaced every 18"',
      'Micro-mesh Leaf Guard Systems',
      'Oversized downspouts for intensive downpours'
    ],
    climateFeature: 'Heavy-gauge internal brackets that resist snow load structural bending.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'Decks',
    title: 'Custom Craftsman Decks & Porches',
    tagline: 'Maintenance-Free Composites. Elevated Outdoor Living.',
    description: 'Built to extend your livable space. Whether treating kiln-dried natural wood or setting down composite systems like Trex®, we plan and build pristine, structural decks from the ground up.',
    duration: '1 to 2 Weeks',
    materials: [
      'Trex Select & Transcend Composite Boards',
      'Structural 6x6 Ground-level Posts',
      'Concealed fastening connectors (no visible screws)',
      'Heavy-duty concrete caissons dug to 48" frost-line'
    ],
    climateFeature: 'True 48" depth post footings preventing Erie county winter soil heaving.',
    image: 'https://images.unsplash.com/photo-1598977123418-45f04b61b99e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'Remodeling',
    title: 'Interior Renovations & Remodels',
    tagline: 'Custom Layout Designs. Precision Craftsmanship.',
    description: 'Updating your interior to live beautifully. We construct outstanding bathroom retreats, expansive gourmet kitchens, and modern dry basements with professional custom layouts and detailed finish trims.',
    duration: '2 to 3 Weeks',
    materials: [
      'Solid wood custom cabinets & custom trims',
      'Premium Cambria Quartz and Granite countertops',
      'Moisture-resistant greenboard drywall and barrier wraps',
      'Schluter-Kerdi professional waterproof shower assemblies'
    ],
    climateFeature: 'Professional thermal envelope insulating to shut out draft zones.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
  }
];

export default function ServiceShowcase({ onSelectEstimate }: ServiceShowcaseProps) {
  const [selectedService, setSelectedService] = useState<ProjectCategory>('Roofing');
  
  // Calculator States
  const [roofArea, setRoofArea] = useState<number>(1800);
  const [roofMaterial, setRoofMaterial] = useState<string>('architectural'); // architectural, metal, premium
  const [roofIceGuard, setRoofIceGuard] = useState<boolean>(true);

  const [sidingArea, setSidingArea] = useState<number>(2000);
  const [sidingMaterial, setSidingMaterial] = useState<string>('mastic_vinyl'); // mastic_vinyl, hardie_board
  const [sidingInsulated, setSidingInsulated] = useState<boolean>(true);

  const [gutterLength, setGutterLength] = useState<number>(150);
  const [gutterGuard, setGutterGuard] = useState<boolean>(true);

  const [deckArea, setDeckArea] = useState<number>(240); // L x W
  const [deckMaterial, setDeckMaterial] = useState<string>('composite_trex'); // pine, composite_trex

  const [remodelType, setRemodelType] = useState<string>('bathroom_primary'); // kitchen, bathroom_primary, basement
  const [remodelScope, setRemodelScope] = useState<string>('mid_range'); // mid_range, custom_luxury

  const activeService = SERVICES_DATA.find((s) => s.id === selectedService) || SERVICES_DATA[0];

  // Estimate calculation functions based on real WNY fair averages
  const calculateRoofEstimate = () => {
    let pricePerSqFt = roofMaterial === 'metal' ? 8.5 : roofMaterial === 'premium' ? 6.2 : 4.5;
    let base = roofArea * pricePerSqFt;
    if (roofIceGuard) base += roofArea * 0.45; // WNY leak guard
    return { min: Math.round(base * 0.95), max: Math.round(base * 1.15) };
  };

  const calculateSidingEstimate = () => {
    let pricePerSqFt = sidingMaterial === 'hardie_board' ? 10.5 : 5.8;
    let base = sidingArea * pricePerSqFt;
    if (sidingInsulated) base += sidingArea * 0.85; // Extra energy barrier wrap
    return { min: Math.round(base * 0.95), max: Math.round(base * 1.15) };
  };

  const calculateGutterEstimate = () => {
    let costPerFoot = 9.5;
    let base = gutterLength * costPerFoot;
    if (gutterGuard) base += gutterLength * 5.5; // Premium steel leaf screens
    return { min: Math.round(base * 0.95), max: Math.round(base * 1.12) };
  };

  const calculateDeckEstimate = () => {
    let pricePerSqFt = deckMaterial === 'composite_trex' ? 26 : 14;
    let base = deckArea * pricePerSqFt;
    return { min: Math.round(base * 0.92), max: Math.round(base * 1.15) };
  };

  const calculateRemodelEstimate = () => {
    let base = 12000;
    if (remodelType === 'kitchen') {
      base = remodelScope === 'custom_luxury' ? 32000 : 18000;
    } else if (remodelType === 'bathroom_primary') {
      base = remodelScope === 'custom_luxury' ? 19000 : 9500;
    } else { // basement
      base = remodelScope === 'custom_luxury' ? 28000 : 14000;
    }
    return { min: Math.round(base * 0.9), max: Math.round(base * 1.1) };
  };

  const getEstimate = () => {
    switch (selectedService) {
      case 'Roofing': return calculateRoofEstimate();
      case 'Siding': return calculateSidingEstimate();
      case 'Gutters': return calculateGutterEstimate();
      case 'Decks': return calculateDeckEstimate();
      case 'Remodeling': return calculateRemodelEstimate();
      default: return { min: 0, max: 0 };
    }
  };

  const getCalculatorDimensionsText = () => {
    switch (selectedService) {
      case 'Roofing':
        return `${roofArea} sq ft roof surface, Material: ${roofMaterial === 'metal' ? 'Standing Seam Metal' : roofMaterial === 'premium' ? 'Designer Shingles' : 'Architectural Shingles'}${roofIceGuard ? ', with Premium double-width weather protection eave guard.' : ''}`;
      case 'Siding':
        return `${sidingArea} sq ft siding wall space, Material: ${sidingMaterial === 'hardie_board' ? 'James Hardie Fiber Cement' : 'Premium Insulated Vinyl'}${sidingInsulated ? ', with high-density foam house wrap lining.' : ''}`;
      case 'Gutters':
        return `${gutterLength} lineal feet gutters, Gutters width: 6 inch${gutterGuard ? ', with micromesh anti-debris gutter screens.' : ''}`;
      case 'Decks':
        return `${deckArea} sq ft deck area, Pier level: 48" depth foundations, Material: ${deckMaterial === 'composite_trex' ? 'High-Performance Trex Composite' : 'Southern Yellow Pine'}`;
      case 'Remodeling':
        return `Interior Remodeling Category: ${remodelType === 'kitchen' ? 'Gourmet Kitchen Remodel' : remodelType === 'basement' ? 'Finished Utility Basement' : 'Primary Full Bathroom Unit'}, Sizing and Finishing Selection: ${remodelScope === 'custom_luxury' ? 'Premium Custom finishes' : 'Traditional builder standard.'}`;
      default:
        return '';
    }
  };

  const handleEstimateForward = () => {
    const text = getCalculatorDimensionsText();
    onSelectEstimate(selectedService, text);
  };

  const estimate = getEstimate();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="services_section_view">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-amber-600 uppercase tracking-widest text-xs font-bold font-sans">
          Expertise Built to Outlast
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl mt-2">
          High-Performance Contracting Trades
        </h2>
        <p className="mt-4 text-stone-600 text-base leading-relaxed">
          From full roof retrofits to maintenance-free composite decks, O'Connor Contracting provides skilled architectural and residential carpentry tailored to handle North America's demanding lakeshore climates.
        </p>
      </div>

      {/* Main Grid Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Trade Select Nav */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 bg-stone-100 p-2 rounded-xl sticky top-24 z-10">
          {SERVICES_DATA.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-3 rounded-lg px-4 py-3 text-sm font-display font-medium tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                selectedService === service.id
                  ? 'bg-amber-500 text-stone-950 shadow-sm font-semibold'
                  : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
              }`}
            >
              <Hammer className="h-4 w-4 shrink-0" />
              <span>{service.id}</span>
            </button>
          ))}
        </div>

        {/* Middle Column: Trade Focus & High Definition Display */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            {/* Aspect specific container */}
            <div className="aspect-[4/3] w-full bg-stone-900 relative">
              <img
                src={activeService.image}
                alt={activeService.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 transition-all duration-300 transform scale-100 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-stone-100">
                <span className="bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                  ACTIVE SPECIALTY
                </span>
                <h3 className="text-xl font-display font-bold mt-1.5">{activeService.title}</h3>
              </div>
            </div>

            {/* Spec Details Card */}
            <div className="p-6 space-y-6">
              <div>
                <p className="text-amber-600 font-display font-medium text-sm italic">{activeService.tagline}</p>
                <p className="text-stone-600 text-sm mt-2 leading-relaxed">{activeService.description}</p>
              </div>

              {/* Scope details lists */}
              <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-stone-800">Timeline Match</span>
                    <span className="text-stone-500">{activeService.duration}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Shield className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-stone-800">WNY Insurance</span>
                    <span className="text-stone-500">Fully Claim-Approved</span>
                  </div>
                </div>
              </div>

              {/* Climate Proof Specialty Banner */}
              <div className="bg-stone-50 border border-stone-200/60 p-4 rounded-xl flex items-start gap-3">
                <CloudSnow className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold uppercase tracking-wider text-stone-800">Buffalo Frost Defense</span>
                  <p className="text-xs text-stone-600 leading-relaxed">{activeService.climateFeature}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Materials Certifications */}
          <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl border border-stone-800 space-y-4">
            <h4 className="text-sm font-display font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Standard Heavy-Duty Materials Spec
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-stone-300">
              {activeService.materials.map((mat, idx) => (
                <li key={idx} className="flex items-center gap-1.5 leading-snug">
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full shrink-0" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Dynamic Interactive Calculator */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-stone-900 leading-none">WNY Instant Estimator</h3>
              <span className="text-[10px] font-mono text-stone-500">Interactive Project Budgeter</span>
            </div>
          </div>

          {/* Variable Inputs Selector Card */}
          <div className="space-y-5 text-sm">
            
            {/* Category Roofing variables */}
            {selectedService === 'Roofing' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-700">Roof Area Sizing</span>
                    <span className="font-mono text-amber-600 font-semibold">{roofArea} sq ft</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="4500"
                    step="50"
                    value={roofArea}
                    onChange={(e) => setRoofArea(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1.5 bg-stone-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-stone-400">
                    <span>1,000 sq ft</span>
                    <span>Typical Cottage</span>
                    <span>4,500 sq ft</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">Specialty Materials Option</label>
                  <select
                    value={roofMaterial}
                    onChange={(e) => setRoofMaterial(e.target.value)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 text-xs bg-stone-50 font-medium"
                  >
                    <option value="architectural">CertainTeed Landmark Architectural Shingles</option>
                    <option value="premium">Premium Thick Slate Designer Shingles</option>
                    <option value="metal">Continuous Standing-Seam Structural Metal</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5 bg-stone-50 p-2.5 border border-stone-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="roofIceGuardCheck"
                    checked={roofIceGuard}
                    onChange={(e) => setRoofIceGuard(e.target.checked)}
                    className="h-4 w-4 accent-amber-500 rounded text-stone-900 cursor-pointer"
                  />
                  <label htmlFor="roofIceGuardCheck" className="text-xs text-stone-600 cursor-pointer font-medium leading-none">
                    Reinforce double-depth Ice & Gutter Protection line
                  </label>
                </div>
              </div>
            )}

            {/* Category Siding variables */}
            {selectedService === 'Siding' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-700">Exterior Wall Siding Area</span>
                    <span className="font-mono text-amber-600 font-semibold">{sidingArea} sq ft</span>
                  </div>
                  <input
                    type="range"
                    min="850"
                    max="4000"
                    step="50"
                    value={sidingArea}
                    onChange={(e) => setSidingArea(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1.5 bg-stone-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-stone-400">
                    <span>850 sq ft</span>
                    <span>Split-Level</span>
                    <span>4,000 sq ft</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">Cladding Selection</label>
                  <select
                    value={sidingMaterial}
                    onChange={(e) => setSidingMaterial(e.target.value)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 text-xs bg-stone-50 font-medium"
                  >
                    <option value="mastic_vinyl">Mastic Elite Heavy-duty Insulated Vinyl</option>
                    <option value="hardie_board">James Hardie® autoclaved Fiber Cement</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5 bg-stone-50 p-2.5 border border-stone-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="sidingInsulatedCheck"
                    checked={sidingInsulated}
                    onChange={(e) => setSidingInsulated(e.target.checked)}
                    className="h-4 w-4 accent-amber-500 rounded text-stone-900 cursor-pointer"
                  />
                  <label htmlFor="sidingInsulatedCheck" className="text-xs text-stone-600 cursor-pointer font-medium leading-none">
                    Underlay 1/2" Expanded EPS ComfortInsure Wrap
                  </label>
                </div>
              </div>
            )}

            {/* Category Gutters variables */}
            {selectedService === 'Gutters' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-700">Linear Foot Length</span>
                    <span className="font-mono text-amber-600 font-semibold">{gutterLength} lineal ft</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="350"
                    step="10"
                    value={gutterLength}
                    onChange={(e) => setGutterLength(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1.5 bg-stone-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-stone-400">
                    <span>60 ft</span>
                    <span>Gargoyles/Bungalow</span>
                    <span>350 ft</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-stone-50 p-2.5 border border-stone-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="gutterGuardCheck"
                    checked={gutterGuard}
                    onChange={(e) => setGutterGuard(e.target.checked)}
                    className="h-4 w-4 accent-amber-500 rounded text-stone-900 cursor-pointer"
                  />
                  <label htmlFor="gutterGuardCheck" className="text-xs text-stone-600 cursor-pointer font-medium leading-none">
                    Include Continuous Micro-Mesh Leaf Guards
                  </label>
                </div>
                <div className="text-[11px] text-stone-500 leading-normal flex gap-1 bg-stone-50 p-2.5 border border-stone-100 rounded-lg">
                  <Info className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Includes heavy-duty aluminum custom hangers spaced every 18" to hold deep winter ice weight.</span>
                </div>
              </div>
            )}

            {/* Category Decks variables */}
            {selectedService === 'Decks' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span className="text-stone-700">Deck Sizing (Width × Length)</span>
                    <span className="font-mono text-amber-600 font-semibold">{deckArea} sq ft</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="650"
                    step="10"
                    value={deckArea}
                    onChange={(e) => setDeckArea(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-ew-resize h-1.5 bg-stone-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-stone-400">
                    <span>100 sq ft (10x10)</span>
                    <span>Standard Patio</span>
                    <span>650 sq ft (20x32)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">Plank Material Grade</label>
                  <select
                    value={deckMaterial}
                    onChange={(e) => setDeckMaterial(e.target.value)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 text-xs bg-stone-50 font-medium"
                  >
                    <option value="pine">Pressure-Treated Structural Southern Yellow Pine</option>
                    <option value="composite_trex">Premium Maintenance-Free Trex® Composite boards</option>
                  </select>
                </div>
                <div className="text-[11px] text-stone-500 leading-normal bg-amber-50 border border-amber-200/50 p-2.5 rounded-lg">
                  <span>Footings are consistently anchored 48 inches deep to withstand severe soil expansion during spring thaws.</span>
                </div>
              </div>
            )}

            {/* Category Remodeling variables */}
            {selectedService === 'Remodeling' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">Interior Room Type</label>
                  <select
                    value={remodelType}
                    onChange={(e) => setRemodelType(e.target.value)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 text-xs bg-stone-50 font-medium"
                  >
                    <option value="bathroom_primary">Primary Full Suite Bath Remodel</option>
                    <option value="kitchen">Custom Eat-in Gourmet Kitchen Remodel</option>
                    <option value="basement">Dry finished multi-purpose basement layout</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">Materials and Trims standard</label>
                  <select
                    value={remodelScope}
                    onChange={(e) => setRemodelScope(e.target.value)}
                    className="w-full border border-stone-300 rounded px-2.5 py-1.5 text-xs bg-stone-50 font-medium"
                  >
                    <option value="mid_range">Elite Craft (Premium fixtures, quartz/vinyl options)</option>
                    <option value="custom_luxury">Custom Masterworks (High-End solid woods, custom layouts, stone slab features)</option>
                  </select>
                </div>
              </div>
            )}

          </div>

          {/* Quick budget Projection display */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-2">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400">
              Western New York Estimate Range
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-sans text-stone-900 border-b-2 border-stone-900 leading-none">
                ${estimate.min.toLocaleString()}
              </span>
              <span className="text-sm font-mono text-stone-400">to</span>
              <span className="text-2xl font-bold font-sans text-amber-600 border-b-2 border-amber-600 leading-none col-span-2">
                ${estimate.max.toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 leading-relaxed font-mono pt-1">
              *Rough WNY materials average. Actual quote depends strictly on slope, rafters, accessibility, and architectural inspection.
            </p>
          </div>

          {/* Transfer button to AI Project companion */}
          <button
            onClick={handleEstimateForward}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-stone-100 font-display font-bold py-3 text-xs tracking-wider uppercase transition-all duration-300 shadow-sm cursor-pointer border border-stone-800"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Generate AI Project Plan</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
