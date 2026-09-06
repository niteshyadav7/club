import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { ShieldCheck, UserCheck, User, Clock, LogIn, Sparkles } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { role, handleRoleSwitch, currentUser, isPending, setGoogleModalOpen, handleGoogleSignIn } = useAuth();

  const roles: { key: UserRole; label: string; icon: any; desc: string; badgeColor: string }[] = [
    {
      key: 'ADMIN',
      label: 'Admin',
      icon: ShieldCheck,
      desc: 'Approves Signups, Pre-Adds Phones, Manages Badges & Dues',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      key: 'CORE_MEMBER',
      label: 'Core Member',
      icon: UserCheck,
      desc: 'Submits Expense Claims with Receipts, Creates Events',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
      key: 'GENERAL_MEMBER',
      label: 'General Member',
      icon: User,
      desc: 'Transparent Dues & Ledger View, Directory, Wishes',
      badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
    },
    {
      key: 'PENDING',
      label: 'Pending Applicant',
      icon: Clock,
      desc: 'New Google Signup awaiting Admin Verification',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  ];

  return (
    <aside aria-label="Interactive Demo Switcher" className="bg-[#1a1f29] text-white text-xs border-b border-gray-800 px-4 py-2 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Persona Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 font-semibold text-indigo-300 uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Live Persona Mode:
          </span>
          <div className="flex items-center gap-1 bg-[#12151b] p-1 rounded-full border border-gray-800">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = role === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => handleRoleSwitch(r.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold border border-indigo-500'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                  }`}
                  title={r.desc}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active User Info & Google Sign-In */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-gray-300">
            <span>Logged in as:</span>
            <span className="font-semibold text-white underline decoration-indigo-500 underline-offset-2">
              {currentUser ? currentUser.name : 'Guest'}
            </span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full border font-semibold ${
              isPending
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {isPending ? '⏳ Awaiting Verification' : '✓ Verified'}
            </span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="flex items-center gap-1.5 bg-white text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-full font-semibold text-xs transition shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google Auth</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
