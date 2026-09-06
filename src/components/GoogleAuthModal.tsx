import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '../store';
import { X, ShieldCheck, UserCheck, User, UserPlus } from 'lucide-react';

export const GoogleAuthModal: React.FC = () => {
  const { isGoogleModalOpen, setGoogleModalOpen, handleSimulatedGoogleLogin, handleGoogleSignIn } = useAuth();
  const members = useAppSelector((state) => state.members.members);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isCustomForm, setIsCustomForm] = useState(false);

  if (!isGoogleModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
        <button
          onClick={() => setGoogleModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-gray-900">Sign in with Google</h3>
          <p className="text-xs text-gray-500 mt-1">
            Choose a member profile or register a new applicant account
          </p>
        </div>

        {!isCustomForm ? (
          <div className="space-y-2.5">
            {/* Real Google Auth direct button */}
            <button
              onClick={() => {
                setGoogleModalOpen(false);
                handleGoogleSignIn();
              }}
              className="w-full flex items-center justify-center gap-2.5 p-3 rounded-2xl border-2 border-indigo-600 bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Connect Live Google Popup</span>
            </button>

            {members.length > 0 && (
              <>
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-gray-400 font-bold text-[10px] uppercase">
                      Or select existing member
                    </span>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {members.slice(0, 6).map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleSimulatedGoogleLogin(member.email, member.name, member.photoUrl)}
                      className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition text-left group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={member.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-indigo-600 transition shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition truncate">
                            {member.name}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate">{member.email}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 shrink-0">
                        {member.role.replace('_', ' ')}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsCustomForm(true)}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                + Register New Account Profile
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customName && customEmail) {
                handleSimulatedGoogleLogin(customEmail, customName);
              }
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter Full Name"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Google Email</label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsCustomForm(false)}
                className="flex-1 btn-secondary text-xs py-2"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary text-xs py-2"
              >
                Submit Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
