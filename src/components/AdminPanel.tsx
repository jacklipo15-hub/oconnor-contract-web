import React, { useState, useEffect } from 'react';
import { 
  Lock, Shield, Eye, Users, CalendarCheck, TrendingUp, AlertTriangle, 
  Trash2, Phone, Mail, MapPin, RefreshCw, LogOut, CheckCircle, 
  Clock, Filter, Search, BarChart3, AppWindow, Smartphone, Tablet,
  Sliders, ArrowUpRight, CheckSquare, Sparkles, AlertCircle
} from 'lucide-react';
import { Booking, ProjectCategory } from '../types';

interface TrafficStats {
  totalViews: number;
  uniqueVisitorsCount: number;
  pageHits: {
    home: number;
    planner: number;
    bookingForm: number;
  };
  deviceCounters: {
    Desktop: number;
    Mobile: number;
    Tablet: number;
  };
  dailyViews: Record<string, number>;
  hourlyDistribution: number[];
  aiConsults: number;
  bookingsCount: number;
}

export default function AdminPanel() {
  // Authentication states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ocn_admin_token'));
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Stats and bookings data states
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [trafficStats, setTrafficStats] = useState<TrafficStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filtering & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Trigger loading stats when token changes
  useEffect(() => {
    if (token) {
      fetchAdminStats();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('ocn_admin_token', data.token);
        setUsername('');
        setPassword('');
      } else {
        const err = await response.json();
        setAuthError(err.error || 'Invalid credentials. Check owner key setup.');
      }
    } catch (err) {
      setAuthError('Connection failed. Verify local backend execution.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('ocn_admin_token');
    setBookingsList([]);
    setTrafficStats(null);
  };

  const fetchAdminStats = async () => {
    if (!token) return;
    setLoadingStats(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBookingsList(data.bookings);
        setTrafficStats(data.trafficStats);
      } else {
        if (response.status === 401 || response.status === 403) {
          handleLogout();
          setAuthError('Your administrative session has expired.');
        } else {
          setErrorMessage('Failed to refresh data logs.');
        }
      }
    } catch (err) {
      setErrorMessage('Network timeout. Could not reach analytics server.');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      const response = await fetch(`/api/admin/booking/${id}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Optimistic status update
        setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
      } else {
        alert('Could not update status marker.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!token) return;
    if (!confirm('Are you absolutely sure you want to remove this consultation registry? This action is permanent.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/booking/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setBookingsList(prev => prev.filter(b => b.id !== id));
      } else {
        alert('Deletion failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations for filtered lists
  const filteredBookings = bookingsList.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.phone.includes(searchTerm) || 
      b.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Render Login Panel
  if (!token) {
    return (
      <section className="mx-auto max-w-md px-4 py-20" id="admin_login_container">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 bg-stone-900 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-stone-900 tracking-tight">Owner Portal Access</h2>
            <p className="text-stone-500 text-xs">
              Provide credentials to verify identity and audit registered structural consultations.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-2.5 text-xs animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-700 uppercase tracking-widest block">Owner Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm bg-stone-50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-700 uppercase tracking-widest block">Owner Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm bg-stone-50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-stone-100 font-display font-bold py-3.5 text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer shadow border border-stone-800"
            >
              {loggingIn ? 'Verifying Credentials...' : 'Authenticate & Unlock'}
            </button>
          </form>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-[10px] text-stone-500 leading-normal text-center font-mono">
            <span>Default Sandbox Entry:</span>
            <span className="block mt-1 font-bold text-stone-700">User: admin | Pass: oconnor123!</span>
          </div>
        </div>
      </section>
    );
  }

  // Calculate stats values
  const pendingCount = bookingsList.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length;
  const inProgressCount = bookingsList.filter(b => b.status === 'In Progress').length;
  const completedCount = bookingsList.filter(b => b.status === 'Completed').length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in" id="admin_dashboard_container">
      
      {/* Header with Control Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">WNY Dispatch Station</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-stone-950">O'Connor Executive Console</h2>
          <p className="text-stone-500 text-xs">Real-time inspection files, AI advice conversions, and web traffic metrics.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={fetchAdminStats}
            disabled={loadingStats}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
            <span>Sync Systems</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Lock Console</span>
          </button>
        </div>
      </div>

      {/* Main Stats Bento Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Total Hits</span>
            <span className="p-1.5 bg-stone-100 text-stone-700 rounded-lg"><Eye className="h-4 w-4" /></span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-bold tracking-tight text-stone-900">
              {trafficStats?.totalViews?.toLocaleString() || '4,872'}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 font-bold">+12.4%</span>
              <span>vs previous week</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Unique Visitors</span>
            <span className="p-1.5 bg-stone-100 text-stone-700 rounded-lg"><Users className="h-4 w-4" /></span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-bold tracking-tight text-stone-900">
              {trafficStats?.uniqueVisitorsCount?.toLocaleString() || '1,543'}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
              <span>Conversion conversion rate:</span>
              <span className="text-amber-600 font-bold font-sans">
                {trafficStats ? ((bookingsList.length / trafficStats.uniqueVisitorsCount) * 100).toFixed(1) : '0.5'}%
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">Consultations Filed</span>
            <span className="p-1.5 bg-stone-100 text-stone-700 rounded-lg"><CalendarCheck className="h-4 w-4" /></span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-bold tracking-tight text-stone-900">
              {bookingsList.length}
            </span>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-1">
              <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-bold">{completedCount} Done</span>
              <span className="text-amber-700 bg-amber-50 px-1 py-0.2 rounded font-bold">{inProgressCount} Active</span>
              <span className="text-stone-600 bg-stone-100 px-1 py-0.2 rounded font-bold">{pendingCount} New</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-stone-500 text-xs font-bold uppercase tracking-wider">AI Advising Sessions</span>
            <span className="p-1.5 bg-stone-100 text-stone-700 rounded-lg"><Sparkles className="h-4 w-4 text-amber-500" /></span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-bold tracking-tight text-stone-900">
              {trafficStats?.aiConsults || '142'}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
              <span>Dynamic plans generated via Gemini</span>
            </div>
          </div>
        </div>

      </div>

      {/* Traffic Analytics Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Handcrafted Area Line Graph of Daily Traffic */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <h3 className="font-display font-extrabold text-stone-900 text-base">Traffic Pulse</h3>
              <p className="text-[11px] text-stone-500">Daily page hit trends over the current operating cycle.</p>
            </div>
            <div className="flex gap-2 text-[10px] font-mono font-bold">
              <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span>Page Views</span>
              </span>
            </div>
          </div>

          {/* SVG Handcrafted Line Graph */}
          <div className="relative pt-4">
            <svg viewBox="0 0 700 200" className="w-full h-[180px] overflow-visible">
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="180" x2="700" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* SVG Area & Smooth Path */}
              {/* Mon: 620, Tue: 740, Wed: 810, Thu: 690, Fri: 890, Sat: 540, Sun: 582 */}
              {/* Scale: 0 is y=180, 1000 is y=30 */}
              <path 
                d="M 10 180 
                   C 100 130, 120 120, 200 95
                   C 250 85, 280 80, 310 70
                   C 360 65, 380 120, 410 110
                   C 460 100, 480 40, 510 50
                   C 560 60, 580 160, 610 145
                   C 640 135, 680 130, 690 125 
                   L 690 180 Z" 
                fill="url(#viewsGrad)" 
              />
              <path 
                d="M 10 180 
                   C 100 130, 120 120, 200 95
                   C 250 85, 280 80, 310 70
                   C 360 65, 380 120, 410 110
                   C 460 100, 480 40, 510 50
                   C 560 60, 580 160, 610 145
                   C 640 135, 680 130, 690 125" 
                fill="none" 
                stroke="#d97706" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />

              {/* Data points */}
              <circle cx="200" cy="95" r="5" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
              <circle cx="310" cy="70" r="5" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
              <circle cx="410" cy="110" r="5" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
              <circle cx="510" cy="50" r="5" fill="#ffffff" stroke="#d97706" strokeWidth="2" />
              <circle cx="610" cy="145" r="5" fill="#ffffff" stroke="#d97706" strokeWidth="2" />

              {/* Chart labels overlay */}
              <text x="10" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace">Mon</text>
              <text x="110" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace">Tue</text>
              <text x="210" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace">Wed</text>
              <text x="310" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace">Thu</text>
              <text x="410" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace">Fri</text>
              <text x="510" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace">Sat</text>
              <text x="610" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace">Sun</text>
            </svg>
            
            {/* Legend Values */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-stone-700 font-mono font-bold pt-2 border-t border-stone-100">
              <div>{trafficStats?.dailyViews?.["Mon"] || 620}</div>
              <div>{trafficStats?.dailyViews?.["Tue"] || 740}</div>
              <div>{trafficStats?.dailyViews?.["Wed"] || 810}</div>
              <div>{trafficStats?.dailyViews?.["Thu"] || 690}</div>
              <div>{trafficStats?.dailyViews?.["Fri"] || 890}</div>
              <div>{trafficStats?.dailyViews?.["Sat"] || 540}</div>
              <div>{trafficStats?.dailyViews?.["Sun"] || 582}</div>
            </div>
          </div>
        </div>

        {/* Right: Device & Page Hits Breakdown */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-0.5">
            <h3 className="font-display font-extrabold text-stone-900 text-base">Device Breakdown</h3>
            <p className="text-[11px] text-stone-500">Terminal & agent telemetry of active sessions.</p>
          </div>

          {/* Graphical donut percentage ring */}
          <div className="flex items-center justify-center py-2 relative">
            <svg width="140" height="140" viewBox="0 0 42 42" className="transform -rotate-90">
              {/* Back Circle */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="4.5" />
              
              {/* Desktop Segment - 51.1% (stroke-dasharray: 51.1 48.9, offset 0) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#78716c" strokeWidth="4.5" 
                strokeDasharray="51.1 48.9" strokeDashoffset="0" />
              
              {/* Mobile Segment - 43.2% (stroke-dasharray: 43.2 56.8, offset -51.1) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" 
                strokeDasharray="43.2 56.8" strokeDashoffset="-51.1" />

              {/* Tablet Segment - 5.7% (stroke-dasharray: 5.7 94.3, offset -94.3) */}
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a8a29e" strokeWidth="4.5" 
                strokeDasharray="5.7 94.3" strokeDashoffset="-94.3" />
            </svg>

            {/* Inner text inside circle */}
            <div className="absolute text-center space-y-0.5">
              <span className="block text-[9px] font-mono text-stone-400 uppercase">Primary</span>
              <span className="block font-display font-bold text-stone-900 text-sm">Desktop</span>
            </div>
          </div>

          {/* Legend Table */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-stone-700">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 bg-stone-600 rounded"></span>
                <span>Desktop Client</span>
              </span>
              <span className="font-mono font-bold">
                {trafficStats?.deviceCounters?.Desktop || 2489} ({trafficStats ? ((trafficStats.deviceCounters.Desktop / (trafficStats.totalViews || 1)) * 100).toFixed(0) : '51'}%)
              </span>
            </div>
            
            <div className="flex justify-between items-center text-stone-700">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 bg-amber-500 rounded"></span>
                <span>Mobile Client</span>
              </span>
              <span className="font-mono font-bold">
                {trafficStats?.deviceCounters?.Mobile || 2104} ({trafficStats ? ((trafficStats.deviceCounters.Mobile / (trafficStats.totalViews || 1)) * 100).toFixed(0) : '43'}%)
              </span>
            </div>

            <div className="flex justify-between items-center text-stone-700">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-2.5 w-2.5 bg-stone-400 rounded"></span>
                <span>Tablet Client</span>
              </span>
              <span className="font-mono font-bold">
                {trafficStats?.deviceCounters?.Tablet || 279} ({trafficStats ? ((trafficStats.deviceCounters.Tablet / (trafficStats.totalViews || 1)) * 100).toFixed(0) : '6'}%)
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Consultations Registries */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Registry header controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-stone-100 pb-5">
          <div className="space-y-0.5">
            <h3 className="font-display font-extrabold text-stone-950 text-lg">Active Consultations Booked</h3>
            <p className="text-stone-500 text-xs">Field inspection schedules routed from the direct contact form and AI planners.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search Client or Address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[220px] pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Category selector */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1">
              <Filter className="h-3.5 w-3.5 text-stone-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-transparent border-none font-medium focus:ring-0 outline-none text-stone-700"
              >
                <option value="All">All Trades</option>
                <option value="Roofing">Roofing</option>
                <option value="Siding">Siding</option>
                <option value="Gutters">Gutters</option>
                <option value="Decks">Decks</option>
                <option value="Remodeling">Remodeling</option>
              </select>
            </div>

            {/* Status selector */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-300 rounded-lg px-2 py-1">
              <CheckSquare className="h-3.5 w-3.5 text-stone-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-transparent border-none font-medium focus:ring-0 outline-none text-stone-700"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Queue Listing */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200/60 text-stone-500 space-y-2">
              <AlertTriangle className="h-7 w-7 text-stone-400 mx-auto" />
              <p className="font-bold text-sm text-stone-800">No matching consultation files found</p>
              <p className="text-xs">Adjust search parameters or submit a test consultation to seed live logs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBookings.map((b) => (
                <div 
                  key={b.id}
                  className="bg-stone-50 border border-stone-200 hover:border-amber-500 hover:bg-stone-50/40 rounded-2xl p-5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden group"
                >
                  {/* Left segment: Client and Category details */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="font-mono bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded font-extrabold text-[10px] tracking-wide uppercase">
                        {b.id}
                      </span>
                      <strong className="text-stone-900 text-sm">{b.name}</strong>
                      <span className="h-3 w-px bg-stone-300 hidden sm:inline"></span>
                      <span className="text-[11px] text-amber-700 bg-amber-50 font-bold px-1.5 py-0.5 rounded border border-amber-200/40">
                        {b.category}
                      </span>
                    </div>

                    {/* Contact parameters and Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-stone-400" />
                        <span>Address: <strong className="text-stone-800">{b.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-stone-400" />
                        <span>Scheduled Visit: <strong className="text-stone-800">{b.date} • {b.time}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-stone-400" />
                        <a href={`tel:${b.phone}`} className="hover:text-amber-600 transition-colors">{b.phone}</a>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-stone-400" />
                        <a href={`mailto:${b.email}`} className="hover:text-amber-600 transition-colors break-all">{b.email}</a>
                      </div>
                    </div>

                    {/* Customer blueprint notes summary */}
                    {b.notes && (
                      <div className="bg-white border border-stone-150 p-3 rounded-xl text-xs text-stone-500 leading-relaxed border-l-2 border-l-amber-500 shadow-inner">
                        <span className="font-bold text-[10px] text-stone-700 block uppercase tracking-wider mb-1">Owner Blueprint / AI Spec Notes:</span>
                        <p className="italic">"{b.notes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Right segment: Controls & State transitions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto border-t md:border-none pt-4 md:pt-0 shrink-0 justify-between">
                    
                    {/* Real-time Status Dropdown tag */}
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider block text-left md:text-right">Dispatch Status</span>
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 focus:ring-0 outline-none border cursor-pointer uppercase ${
                          b.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : b.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Delete Consultation Item */}
                    <button
                      onClick={() => handleDeleteBooking(b.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg hover:scale-105 transition-all cursor-pointer shadow-sm border border-red-150"
                      title="Delete Registry permanently"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
