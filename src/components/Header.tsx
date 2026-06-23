import React from 'react';
import { Phone, ShieldCheck, Star, Menu, X, Landmark, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'services', label: 'Contracting Services' },
    { id: 'cli-planner', label: 'AI Project Advisor' },
    { id: 'booking', label: 'Book Consultation' },
    { id: 'standards', label: 'Safety & Insurance' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-stone-900 text-stone-100 shadow-sm">
      {/* Micro Trust Banner */}
      <div className="w-full bg-amber-600 px-4 py-1.5 text-center text-xs font-semibold tracking-wider text-amber-50 md:flex md:items-center md:justify-between md:px-8">
        <div className="flex justify-center items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>WESTERN NEW YORK GENERAL CONTRACTING LIC #NY-1049-C</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-100 text-amber-100" />
            <span>A+ accredited BBB Business</span>
          </span>
          <span className="h-3 w-px bg-amber-400"></span>
          <span>100% Fully Insured ($2M Liability Coverage)</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Brand / Built-In Monogram */}
          <div 
            onClick={() => setActiveTab('services')} 
            className="flex cursor-pointer items-center gap-3 active:scale-95 transition-transform"
          >
            {/* Geometric architectural logo */}
            <div className="flex h-12 w-12 items-center justify-center rounded bg-amber-500 font-display text-2xl font-bold text-stone-950 shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 border-2 border-stone-950 opacity-10"></div>
              O'C
            </div>
            <div>
              <span className="block font-display text-xl font-bold tracking-tight text-white leading-none">
                CONNOR
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-amber-500 font-medium mt-0.5">
                Contracting
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-1 py-2 font-display text-sm font-medium tracking-wide transition-all duration-200 hover:text-amber-400 cursor-pointer ${
                  activeTab === item.id 
                    ? 'text-amber-500' 
                    : 'text-stone-300'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-amber-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Business Hours & Quick Hotline Access */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <span className="block text-xs font-mono text-stone-400 leading-none">WNY Dispatch Hotline</span>
              <a 
                href="tel:7166013829" 
                className="font-display font-bold text-lg text-amber-500 hover:text-amber-400 transition-colors"
                id="header_phone_link"
              >
                (716) 601-3829
              </a>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-amber-500 hover:bg-stone-700 transition-colors">
              <Phone className="h-5 w-5" />
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-2 text-stone-400 hover:bg-stone-800 hover:text-white lg:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="border-t border-stone-800 bg-stone-904 px-4 py-3 lg:hidden space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full rounded px-4 py-2.5 text-left font-display text-base font-medium transition-colors cursor-pointer ${
                activeTab === item.id
                  ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-amber-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-stone-800 flex items-center justify-between px-4 pb-2">
            <div>
              <span className="block text-[10px] uppercase tracking-widest text-stone-500">Call Dispatch</span>
              <a href="tel:7166013829" className="font-display font-bold text-amber-500 text-md">
                (716) 601-3829
              </a>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-stone-400 font-mono">
              <MapPin className="h-3 w-3 text-amber-500" />
              Buffalo, NY
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
