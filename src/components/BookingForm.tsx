import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Clock, MapPin, CheckCircle2, User, HelpCircle, ShieldAlert, Loader2 } from 'lucide-react';
import { ProjectCategory, Booking } from '../types';

interface BookingFormProps {
  prefilledCategory?: ProjectCategory;
  prefilledNotes?: string;
  onBookingSuccessful: () => void;
}

export default function BookingForm({ prefilledCategory, prefilledNotes, onBookingSuccessful }: BookingFormProps) {
  // Input States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Roofing');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('Amherst, NY');

  // App States
  const [submitting, setSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherLocation, setOtherLocation] = useState('');

  // Prefill hook
  useEffect(() => {
    if (prefilledCategory) {
      setCategory(prefilledCategory);
    }
  }, [prefilledCategory]);

  useEffect(() => {
    if (prefilledNotes) {
      setNotes(prefilledNotes);
    }
  }, [prefilledNotes]);

  // Load existing bookings on load
  const fetchAllBookings = async () => {
    setFetchingBookings(true);
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setAllBookings(data);
      }
    } catch (err) {
      console.error('Failed to load active dispatch bookings', err);
    } finally {
      setFetchingBookings(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, [successBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const submissionLocation = location === 'Other' ? (otherLocation.trim() || 'Other Location') : location;

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          category,
          date,
          time,
          notes,
          location: submissionLocation
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessBooking(data.booking);
        // Clear input states
        setName('');
        setEmail('');
        setPhone('');
        setDate('');
        setNotes('');
        setLocation('Amherst, NY');
        setShowOtherInput(false);
        setOtherLocation('');
        onBookingSuccessful();
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to file booking.');
      }
    } catch (err) {
      console.error(err);
      alert('Network transmission failed. Please contact physical dispatch phone directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" id="booking_section_view">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Details */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
          {successBooking ? (
            <div className="text-center py-12 space-y-6 animate-fade-in">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-2xl text-stone-900">Consultation Date Secured!</h3>
                <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
                  Excellent, <strong className="text-stone-800">{successBooking.name}</strong>. Your structural inspection file has been compiled with dispatch code <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded font-bold text-stone-800">{successBooking.id}</span>.
                </p>
              </div>

              {/* Layout Summary details block */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-stone-200/60 pb-1.5 font-bold">
                  <span className="text-stone-500 uppercase">Consultation Parameter</span>
                  <span className="text-stone-800">{successBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Service Category:</span>
                  <span className="text-stone-800 font-semibold">{successBooking.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Inspection Target Address:</span>
                  <span className="text-stone-800 font-semibold">{successBooking.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Scheduled Visit:</span>
                  <span className="text-stone-800 font-semibold">{successBooking.date} at {successBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status Indicator:</span>
                  <span className="text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold">
                    {successBooking.status}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSuccessBooking(null)}
                  className="rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 font-display font-bold px-6 py-2.5 text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Schedule Another Area
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <span className="text-amber-600 text-xs font-bold uppercase tracking-widest font-sans">
                  Direct Field Routing
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-stone-900 mt-1">
                  Secure Site Consultation Date
                </h3>
                <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                  Provide your target contact markers and location parameters below. A seasoned field inspector from our Buffalo team will call you back to confirm dispatch, checking attic, yard, or roof slopes with digital laser meters.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full name input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="h-4 w-4 text-stone-400" />
                    <span>Your Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Liam O'Connor"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50"
                  />
                </div>

                {/* Email input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-stone-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="liam@wnymail.com"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50"
                  />
                </div>

                {/* Telephone input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-stone-400" />
                    <span>Phone Line Hotline</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(716) 555-0199"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50"
                  />
                </div>

                {/* Site target location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-stone-400" />
                    <span>Target Property Location</span>
                  </label>
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
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50 font-medium"
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
                      className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50 animate-fade-in mt-1.5 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  )}
                </div>

                {/* Specialty Trade */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-stone-400" />
                    <span>Property Specialty Trade</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50 font-medium"
                    required
                  >
                    <option value="Roofing">Architectural Roofing replacement</option>
                    <option value="Siding">Locking Siding installation</option>
                    <option value="Gutters">Seamless rain gutter assemblies</option>
                    <option value="Decks">Composite deck building</option>
                    <option value="Remodeling">Interior room renovations</option>
                  </select>
                </div>

                {/* Select inspection Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-stone-400" />
                    <span>Preferred Inspection Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50 font-medium"
                  />
                </div>

                {/* Select inspection Time slider */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-stone-400" />
                    <span>Hour Segment Preference</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50 font-medium"
                    required
                  >
                    <option value="08:00 AM - 10:00 AM">Morning Early (08:00 AM - 10:00 AM)</option>
                    <option value="10:00 AM - 12:00 PM">Late Morning (10:00 AM - 12:00 PM)</option>
                    <option value="12:00 PM - 02:00 PM">Midday break (12:00 PM - 02:00 PM)</option>
                    <option value="02:00 PM - 04:00 PM">Afternoon peak (02:00 PM - 04:00 PM)</option>
                    <option value="04:00 PM - 06:00 PM">Late shift (04:00 PM - 06:00 PM)</option>
                  </select>
                </div>

                {/* Sizing text / blueprint attachments input */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-widest block">Special site Notes & AI blueprint additions</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Prefilled structural data or customized ideas about matching material colors with neighboring homes."
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm bg-stone-50 h-[80px]"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-stone-100 font-display font-bold py-3.5 text-xs uppercase tracking-wider transition-all duration-305 shadow-sm border border-stone-800"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        <span>Filing structural check...</span>
                      </>
                    ) : (
                      <span>Schedule Free Field Appointment</span>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>

        {/* Right Column: Bookings Queue Panel */}
        <div className="lg:col-span-4 bg-stone-900 text-stone-100 rounded-3xl p-6 border border-stone-800 space-y-5 shadow">
          <div>
            <h4 className="font-display font-bold text-base text-white leading-none">
              Active Dispatch Queue
            </h4>
            <span className="text-[10px] font-mono text-amber-500">Real-Time Schedule Registry</span>
          </div>

          <div className="space-y-3.5 overflow-y-auto max-h-[360px] pr-2 scrollbar-thin">
            {fetchingBookings && (
              <div className="text-center py-6 text-stone-400 text-xs">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-amber-500 mb-1" />
                <span>Loading active dispatches...</span>
              </div>
            )}

            {!fetchingBookings && allBookings.length === 0 && (
              <div className="bg-stone-800/50 p-4 rounded-xl border border-stone-800 text-center text-xs text-stone-400 space-y-1">
                <ShieldAlert className="h-5 w-5 mx-auto text-stone-500" />
                <p className="font-medium">No Inspections Queued Today</p>
                <p className="text-[10px] leading-relaxed font-mono">Submit your form to be first in line for dispatcher callback.</p>
              </div>
            )}

            {!fetchingBookings && allBookings.map((bk) => (
              <div 
                key={bk.id} 
                className="bg-stone-800 border-l-2 border-amber-500 p-3.5 rounded-r-xl border border-stone-800 text-xs flex justify-between items-start leading-relaxed animate-fade-in"
              >
                <div className="space-y-1">
                  <div className="flex gap-1.5 items-center">
                    <span className="font-mono bg-stone-700/60 text-amber-400 px-1 py-0.2 rounded font-bold text-[9px] uppercase tracking-wide">
                      {bk.id}
                    </span>
                    <strong className="text-white text-xs">{bk.name}</strong>
                  </div>
                  <p className="text-stone-300 font-medium text-[11px]">{bk.category} Check</p>
                  <p className="text-[10px] text-stone-400 font-mono">{bk.location} • {bk.date}</p>
                </div>
                <span className="text-emerald-400 bg-emerald-500/10 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-mono shrink-0">
                  {bk.status}
                </span>
              </div>
            ))}
          </div>

          {/* Localized assistance info box inside sidebar */}
          <div className="bg-stone-800 p-4 rounded-2xl border border-stone-800/80 text-[11px] text-stone-400 leading-normal space-y-2">
            <span className="block font-bold text-stone-200">Emergency Dispatch Services</span>
            <p>
              Did severe storm wind or heavy hail strike your roof? Don't wait. Call our Western New York storm inspector directly at **(716) 601-3829** for emergency tarp installation and fast adjuster assistance.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
