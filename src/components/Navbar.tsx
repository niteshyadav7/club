import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setActiveTab, setProfileEditModalOpen } from '../store/slices/uiSlice';
import { setGoogleModalOpen } from '../store/slices/authSlice';
import { useAuth } from '../hooks/useAuth';
import { usePushNotification } from '../hooks/usePushNotification';
import { 
  Users, 
  ReceiptText, 
  Wallet, 
  CalendarDays, 
  Bell, 
  LogOut,
  Award,
  Menu,
  X,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const { currentUser, isPending, handleSignOut } = useAuth();
  const { requestPermission, permission } = usePushNotification();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when full-screen mobile hamburger is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    {
      id: 'directory' as const,
      label: 'Member Directory',
      shortLabel: 'Directory',
      icon: Users,
      desc: 'Explore member roster, leadership & badges',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    },
    {
      id: 'dues' as const,
      label: 'Dues Dashboard',
      shortLabel: 'Dues',
      icon: ReceiptText,
      desc: 'Financial transparency & dues invoices',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      id: 'expenses' as const,
      label: 'Expense Ledger',
      shortLabel: 'Expenses',
      icon: Wallet,
      desc: 'Itemized spends & submitted claims',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50 text-purple-700 border-purple-100',
    },
    {
      id: 'events' as const,
      label: 'Events & Media',
      shortLabel: 'Events',
      icon: CalendarDays,
      desc: 'Club calendar, RSVP & celebration albums',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50 text-amber-700 border-amber-100',
    },
  ];

  const handleNavClick = (tabId: typeof navItems[number]['id']) => {
    dispatch(setActiveTab(tabId));
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ─── MAIN STICKY NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          
          {/* ─── LEFT: Hamburger Button & ClubSphere Brand Logo ─── */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            
            {/* Mobile Hamburger Button */}
            {!isPending && (
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition cursor-pointer flex items-center justify-center shadow-2xs active:scale-95 shrink-0 border border-gray-200/80"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-4 h-4 text-gray-900" />
              </button>
            )}

            {/* Brand Logo & Name */}
            <div 
              onClick={() => !isPending && dispatch(setActiveTab('directory'))}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-w-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-sm group-hover:scale-105 transition-transform duration-200 ring-1 sm:ring-2 ring-indigo-400/30 shrink-0">
                <span className="bg-gradient-to-tr from-indigo-300 via-sky-300 to-white bg-clip-text text-transparent font-black tracking-tight">CS</span>
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight flex items-center gap-1 sm:gap-1.5 truncate leading-tight">
                  <span className="text-gray-900 font-black">Club</span>
                  <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent font-black">Sphere</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-2xs shrink-0">
                    PRO
                  </span>
                </h1>
                <p className="hidden sm:block text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider uppercase leading-none mt-0.5">
                  Community Governance Hub
                </p>
              </div>
            </div>
          </div>

          {/* ─── CENTER: Capsule Pill Navigation (Desktop - Only visible for approved members) ─── */}
          {!isPending && (
            <nav className="hidden md:flex items-center bg-gray-50 p-1 rounded-full border border-gray-200 shadow-2xs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => dispatch(setActiveTab(item.id))}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200/80 font-bold'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span>{item.shortLabel}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* ─── RIGHT: Notification & User Profile Pill ─── */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Push Notification Button (Desktop) */}
            {!isPending && (
              <button
                onClick={requestPermission}
                title={permission === 'granted' ? 'Notifications Active' : 'Enable Web Push Notifications'}
                className="hidden sm:flex relative p-2.5 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition border border-transparent hover:border-indigo-100 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {permission === 'granted' && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
                )}
              </button>
            )}

            {/* User Profile Pill */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1 sm:py-1.5 rounded-full border border-gray-200 shadow-2xs">
                <button
                  onClick={() => !isPending && dispatch(setProfileEditModalOpen(true))}
                  className="flex items-center gap-2 text-left group cursor-pointer"
                  title={isPending ? 'Account pending approval' : 'Click to edit your profile'}
                >
                  <UserAvatar
                    member={currentUser}
                    className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-indigo-500/20 group-hover:ring-indigo-600 transition shrink-0"
                  />
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition flex items-center gap-1">
                      {currentUser.name}
                      {currentUser.badges && currentUser.badges.length > 0 && (
                        <Award className="w-3 h-3 text-amber-500 inline" />
                      )}
                    </div>
                    <div className={`text-[10px] font-bold ${isPending ? 'text-amber-600' : 'text-gray-500'}`}>
                      {isPending ? 'Pending' : currentUser.role.replace('_', ' ')}
                    </div>
                  </div>
                </button>

                <div className="hidden sm:block h-4 w-px bg-gray-200 mx-0.5"></div>

                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="hidden sm:flex p-1 rounded-full text-gray-400 hover:text-rose-600 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => dispatch(setGoogleModalOpen(true))}
                className="btn-primary py-1.5 sm:py-2 px-4 sm:px-5 text-xs font-bold shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── FULL-SCREEN LUXURY MOBILE HAMBURGER MENU OVERLAY ─── */}
      {isMobileMenuOpen && !isPending && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-left duration-250">
          
          {/* Top Header of Hamburger Menu */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center font-black text-xs shadow-sm ring-1 ring-indigo-400/30">
                <span className="bg-gradient-to-tr from-indigo-300 via-sky-300 to-white bg-clip-text text-transparent font-black">CS</span>
              </div>
              <div>
                <div className="text-base font-black tracking-tight flex items-center gap-1.5">
                  <span className="text-gray-900 font-black">Club</span>
                  <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent font-black">Sphere</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-2xs">
                    PRO
                  </span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                  Menu & Navigation
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-900" />
            </button>
          </div>

          {/* Main Body Content of Hamburger Menu */}
          <div className="flex-1 px-5 py-5 space-y-6">
            
            {/* 1. Member Profile Light Luxury Identity Card */}
            {currentUser && (
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/70 border border-indigo-100 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar
                      member={currentUser}
                      className="w-12 h-12 rounded-full ring-2 ring-indigo-500/20 shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-base font-black text-gray-900 truncate flex items-center gap-1.5">
                        {currentUser.name}
                        {currentUser.badges && currentUser.badges.length > 0 && (
                          <Award className="w-4 h-4 text-amber-500 inline shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100/80 text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider mt-1 border border-indigo-200">
                        <ShieldCheck className="w-3 h-3 text-indigo-600" />
                        <span>{currentUser.role.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-indigo-100/70 flex items-center justify-between gap-2 text-xs">
                  <span className="text-gray-600 text-[11px]">
                    Dues Status: <strong className="text-emerald-700 uppercase font-bold">{currentUser.duesStatus || 'PAID'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      dispatch(setProfileEditModalOpen(true));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Portal Sections Navigation Tiles */}
            <div className="space-y-2.5">
              <div className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Portal Navigation</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl flex items-center justify-between transition duration-150 cursor-pointer text-left border active:scale-98 ${
                        isActive
                          ? 'bg-indigo-50/90 text-indigo-900 border-indigo-300 shadow-sm'
                          : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : `${item.bgColor}`
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className={`text-sm font-extrabold ${isActive ? 'text-indigo-950 font-black' : 'text-gray-900'}`}>
                            {item.label}
                          </div>
                          <div className={`text-[11px] truncate ${isActive ? 'text-indigo-700 font-semibold' : 'text-gray-500'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'text-indigo-600'
                            : 'text-gray-400'
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Push Alerts Card */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Push Notifications</div>
                  <div className="text-[10px] text-gray-500">
                    {permission === 'granted' ? 'Alerts active for events & dues' : 'Get instant club announcements'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={requestPermission}
                className="px-3 py-1.5 rounded-xl bg-white text-indigo-700 font-bold text-xs border border-indigo-200 shadow-2xs hover:bg-indigo-50 transition cursor-pointer"
              >
                {permission === 'granted' ? 'Enabled' : 'Enable'}
              </button>
            </div>

          </div>

          {/* Bottom Actions of Hamburger Drawer */}
          <div className="p-5 border-t border-gray-100 space-y-3 bg-white sticky bottom-0 z-10">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleSignOut();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Sign Out / Switch Account</span>
            </button>

            <div className="text-center text-[10px] text-gray-400 font-semibold">
              ClubSphere PRO Enterprise • Community Governance Suite
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default Navbar;
