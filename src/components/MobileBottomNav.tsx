import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setActiveTab } from '../store/slices/uiSlice';
import { useAuth } from '../hooks/useAuth';
import { Users, ReceiptText, Wallet, CalendarDays } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const { currentUser, isPending } = useAuth();

  // If user is not logged in or is pending approval, hide bottom navigation
  if (isPending) {
    return null;
  }

  const navItems = [
    {
      id: 'directory' as const,
      label: 'Directory',
      icon: Users,
    },
    {
      id: 'dues' as const,
      label: 'Dues',
      icon: ReceiptText,
      hasPendingDues: currentUser?.duesStatus === 'PENDING' || currentUser?.duesStatus === 'OVERDUE',
    },
    {
      id: 'expenses' as const,
      label: 'Expenses',
      icon: Wallet,
    },
    {
      id: 'events' as const,
      label: 'Events',
      icon: CalendarDays,
    },
  ];

  const handleTabClick = (tabId: typeof navItems[number]['id']) => {
    if (activeTab === tabId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      dispatch(setActiveTab(tabId));
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] pt-1.5 px-3"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-90 group select-none ${
                isActive
                  ? 'text-indigo-600 font-black'
                  : 'text-gray-400 hover:text-gray-600 font-semibold'
              }`}
            >
              {/* Active Pill Glow Indicator Bar */}
              {isActive && (
                <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 shadow-xs animate-in fade-in zoom-in-75 duration-200" />
              )}

              {/* Icon Container with Subtle Background for Active State */}
              <div
                className={`relative w-12 h-7 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 scale-105 shadow-2xs'
                    : 'group-hover:bg-gray-100/70 text-gray-500'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 transition-transform duration-200 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />

                {/* Status Dot / Badge (e.g., Pending Dues Alert) */}
                {item.hasPendingDues && (
                  <span className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
                )}
              </div>

              {/* Tab Text Label */}
              <span
                className={`text-[10px] tracking-tight mt-0.5 leading-none truncate max-w-full ${
                  isActive
                    ? 'text-indigo-600 font-black scale-105'
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
