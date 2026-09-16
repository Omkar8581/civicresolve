import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <span className="p-1.5 bg-gradient-to-tr from-blue-950 to-blue-800 rounded-lg text-white border border-blue-700/50">🏛️</span>
              <span>CivicResolve</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Citizen Grievance Resolution & Smart Infrastructure Dispatch. Bridging citizens and municipal departments through transparent digital governance.
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Certified Government Portal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Public Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#report" className="hover:text-white transition-colors">Report Road Damage</a></li>
              <li><a href="#report" className="hover:text-white transition-colors">Garbage & Sanitation</a></li>
              <li><a href="#report" className="hover:text-white transition-colors">Streetlight Maintenance</a></li>
              <li><a href="#report" className="hover:text-white transition-colors">Water Supply Complaints</a></li>
              <li><a href="#report" className="hover:text-white transition-colors">Drainage & Flood Alerts</a></li>
            </ul>
          </div>

          {/* Department Directory */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Partner Departments</h4>
            <ul className="space-y-2 text-xs">
              <li>Public Works Department (PWD)</li>
              <li>Solid Waste Management Cell</li>
              <li>Electricity & Streetlighting Div.</li>
              <li>Water Supply & Sewerage Board</li>
              <li>Traffic Police & Transit Auth.</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Civic Helpline</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>Toll-Free: 1800-CIVIC-RES</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>support@civicresolve.gov</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Central Municipal Complex, Zone 1</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CivicResolve. Smart City Digital Infrastructure. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Citizen Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Grievance Redressal</a>
            <a href="#" className="hover:text-slate-300 transition-colors">RTI Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
