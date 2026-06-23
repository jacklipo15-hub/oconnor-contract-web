import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Landmark } from 'lucide-react';

interface FooterProps {
  onSelectTab?: (tab: string) => void;
}

export default function Footer({ onSelectTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-stone-950 text-stone-300 border-t border-stone-800">
      
      {/* Footer Top */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
        
        {/* Brand overview */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-amber-500 font-display text-xl font-bold text-stone-950 shadow-inner">
              O'C
            </div>
            <div>
              <span className="block font-display text-lg font-bold tracking-tight text-white leading-none">
                CONNOR
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-amber-500 font-medium">
                Contracting
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
            Professional contracting craftsmen providing unmatched roofing protection, custom deck installations, seamless gutters, and interior remodeling throughout Erie & Niagara counties. Fully credentialed, family operated, and locally trusted.
          </p>
          <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
            <ShieldCheck className="h-4.5 w-4.5 text-amber-500" />
            <span>Fully Bonded, Insured & Licensed Contractor</span>
          </div>
        </div>

        {/* Areas of distribution */}
        <div className="md:col-span-4 space-y-3.5">
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs border-b border-stone-800 pb-1.5 matches">
            Western New York Dispatch Coverage
          </h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            Our dispatch crews regularly travel throughout Erie County, Niagara County, and neighboring townships:
          </p>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs font-medium text-stone-300">
            <span>• Amherst, NY</span>
            <span>• Cheektowaga, NY</span>
            <span>• Williamsville, NY</span>
            <span>• Orchard Park, NY</span>
            <span>• Clarence, NY</span>
            <span>• West Seneca, NY</span>
            <span>• Tonawanda, NY</span>
            <span>• City of Buffalo</span>
          </div>
        </div>

        {/* Operating hours */}
        <div className="md:col-span-3 space-y-3.5 text-xs">
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs border-b border-stone-800 pb-1.5">
            Office & dispatch hours
          </h4>
          <div className="space-y-2 leading-relaxed">
            <div className="flex justify-between">
              <span className="text-stone-500 font-mono">Monday – Friday:</span>
              <span className="text-stone-200">8:00 AM – 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-mono">Saturday Shift:</span>
              <span className="text-stone-200">9:00 AM – 2:00 PM</span>
            </div>
            <div className="flex justify-between border-t border-stone-900 pt-1.5">
              <span className="text-stone-500 font-mono">Erie Co. Sunday:</span>
              <span className="text-red-400 font-bold">Emergency Only</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="block text-[9px] uppercase tracking-wider text-stone-500 font-mono">Physical Address Location</span>
            <span className="block text-stone-300 font-medium">Serving Greater Buffalo, New York</span>
          </div>
        </div>

      </div>

      {/* Footer Bottom Corporate */}
      <div className="w-full bg-stone-950 border-t border-stone-900 py-6 px-4">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-stone-500 font-mono">
          <p>© {currentYear} O'Connor Contracting WNY. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            {onSelectTab && (
              <>
                <button 
                  onClick={() => onSelectTab('admin')}
                  className="hover:text-amber-500 transition-colors cursor-pointer text-[11px] font-mono outline-none"
                >
                  Owner Portal 🔑
                </button>
                <span>•</span>
              </>
            )}
            <span className="hover:text-amber-500 transition-colors cursor-pointer">Lic. NY-1049-C</span>
            <span>•</span>
            <span className="hover:text-amber-500 transition-colors cursor-pointer text-xs flex items-center gap-1">
              Made with <Heart className="h-3 w-3 fill-amber-500 text-amber-500" /> in Buffalo
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
