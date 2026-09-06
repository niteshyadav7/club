import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles, Database, Plus } from 'lucide-react';

interface AdminBannerProps {
  onPreRegisterClick: () => void;
  onIssueDueClick: () => void;
}

export const AdminBanner: React.FC<AdminBannerProps> = ({
  onPreRegisterClick,
  onIssueDueClick,
}) => {
  return (
    <div className="bg-gradient-to-r from-[#eef2ff] via-[#f0f4ff] to-[#f5f3ff] border border-[#d8e2fd] rounded-2xl p-6 mb-6 shadow-xs relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Graphic & Info */}
        <div className="flex items-start sm:items-center gap-4.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 ring-4 ring-indigo-100">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-700 uppercase tracking-wider bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Live Firebase Connected
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Real-Time Firestore Sync
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Enterprise Governance & Management Suite
            </h3>

            <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
              Full control over member verifications, phone pre-registrations, public dues invoicing, core member reimbursement claims, and itemized event spend breakdowns.
            </p>
          </div>
        </div>

        {/* Right CTA Action Buttons matching CoreUI screenshot style */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button
            onClick={onIssueDueClick}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm hover:shadow active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Due Invoice</span>
          </button>

          <button
            onClick={onPreRegisterClick}
            className="px-4 py-2.5 rounded-xl bg-[#e55353] hover:bg-[#d94242] text-white text-xs font-bold transition shadow-sm hover:shadow active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>Pre-Register Member</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
