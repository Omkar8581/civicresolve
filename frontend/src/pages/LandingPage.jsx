import React from 'react';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Cpu,
  Layers,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const LandingPage = ({ setView, stats }) => {
  const categories = [
    { name: 'Road Damage', icon: '🚧', desc: 'Potholes, broken pavements & surface damage' },
    { name: 'Garbage/Waste', icon: '🗑️', desc: 'Overflowing bins & uncollected garbage' },
    { name: 'Streetlight', icon: '💡', desc: 'Flickering, broken or dark streetlights' },
    { name: 'Water Supply', icon: '🚰', desc: 'Pipe bursts, contamination & supply cuts' },
    { name: 'Drainage', icon: '🌊', desc: 'Clogged gutters, open manholes & waterlogging' },
    { name: 'Public Infrastructure', icon: '🏛️', desc: 'Damaged benches, collapsed railings & parks' },
  ];

  const features = [
    {
      title: 'AI Issue Detection',
      desc: 'Natural language analysis instantly understands problem severity from citizen descriptions and photos.',
      icon: <Cpu className="w-5 h-5 text-teal-600" />
    },
    {
      title: 'Location Detection',
      desc: 'One-click GPS location detection and interactive OpenStreetMap pin selection for precision dispatch.',
      icon: <MapPin className="w-5 h-5 text-teal-600" />
    },
    {
      title: 'Smart Categorization',
      desc: 'Automatic taxonomy classification maps issues accurately across 8 civic departments.',
      icon: <Layers className="w-5 h-5 text-teal-600" />
    },
    {
      title: 'Priority & Severity',
      desc: 'Computer vision and NLP identify immediate public safety hazards near schools, hospitals, or transit.',
      icon: <AlertTriangle className="w-5 h-5 text-teal-600" />
    },
    {
      title: 'Department Routing',
      desc: 'Instant dispatch to specialized municipal teams (PWD, Water Board, Solid Waste Cell) with zero manual delay.',
      icon: <TrendingUp className="w-5 h-5 text-teal-600" />
    },
    {
      title: 'Real-Time Tracking',
      desc: 'Track every step with transparent milestone timelines, officer remarks, and resolution verification.',
      icon: <Clock className="w-5 h-5 text-teal-600" />
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-200 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Smart City AI Civic Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Report. Track. <span className="text-teal-600">Resolve.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            An AI-powered platform that helps citizens report public issues and connects complaints directly to the right municipal department with automated urgency detection.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setView('report')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-base font-bold shadow-lg shadow-teal-600/25 hover:shadow-teal-600/35 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setView('track')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Track Complaint</span>
            </button>
            <button
              onClick={() => setView('auth')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-base transition-colors"
            >
              Login / Register
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-md">
            <div className="text-center p-2 border-r border-slate-100 last:border-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats ? stats.total : '6'}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Total Registered</div>
            </div>
            <div className="text-center p-2 border-r border-slate-100 last:border-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{stats ? stats.inProgress : '3'}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Active In-Progress</div>
            </div>
            <div className="text-center p-2 border-r border-slate-100 last:border-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{stats ? stats.resolved : '2'}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Resolved Successfully</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">{stats ? stats.highPriority : '3'}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">High Priority Hazards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Civic Problem Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Select an Issue Category to Report
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Our multi-modal AI categorizes any public maintenance problem and routes it instantly.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setView('report')}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md cursor-pointer transition-all duration-150 flex flex-col items-center text-center group"
            >
              <span className="text-3xl mb-2.5 transform group-hover:scale-110 transition-transform">{cat.icon}</span>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-teal-700">{cat.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-teal-400 text-xs font-extrabold uppercase tracking-wider">Automated Resolution Lifecycle</span>
            <h2 className="text-3xl font-extrabold mt-1 tracking-tight">How CivicResolve Works</h2>
            <p className="mt-2 text-sm text-slate-400">
              End-to-end transparency from the moment you hit submit to the verified on-site resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              { step: '01', title: 'Report Issue', desc: 'Citizen describes problem and uploads photos or video with GPS coordinates.' },
              { step: '02', title: 'AI Analyzes', desc: 'FastAPI NLP & Vision service detects category, hazard severity, and urgency.' },
              { step: '03', title: 'Smart Route', desc: 'Complaint is assigned automatically to the authorized municipal division.' },
              { step: '04', title: 'Action Taken', desc: 'Field engineer crew arrives on-site, inspects work, and posts updates.' },
              { step: '05', title: 'Track & Verify', desc: 'Citizen tracks status live and receives resolution proof confirmation.' },
            ].map((item, idx) => (
              <div key={item.step} className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/60 relative">
                <div className="text-3xl font-black text-teal-400/30 mb-2 font-mono">{item.step}</div>
                <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Key Platform Capabilities
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Engineered for high municipal throughput, accountability, and citizen trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div key={feat.title} className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white p-8 sm:p-12 text-center shadow-xl shadow-teal-700/20">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready to improve your neighborhood?</h2>
          <p className="mt-3 text-sm sm:text-base text-teal-100 max-w-xl mx-auto">
            Take a photo, describe what is broken, and let our AI handle the rest.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setView('report')}
              className="px-8 py-3.5 rounded-xl bg-white text-teal-800 font-extrabold text-sm shadow-md hover:bg-teal-50 transition-colors"
            >
              Submit a Complaint Now
            </button>
            <button
              onClick={() => setView('admin-login')}
              className="px-6 py-3.5 rounded-xl bg-teal-800/60 hover:bg-teal-800 text-white font-semibold text-sm border border-teal-400/30 transition-colors"
            >
              Officer Portal Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
