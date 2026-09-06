import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AdminSection } from './AdminSidebar';
import { 
  Menu, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  LogOut, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { UserAvatar } from '../UserAvatar';

interface AdminHeaderProps {
  activeSection: AdminSection;
  onToggleSidebar: () => void;
  pendingApprovalsCount: number;
  pendingExpensesCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeSection,
  onToggleSidebar,
  pendingApprovalsCount,
  pendingExpensesCount,
  searchQuery,
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const { currentUser, handleSignOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getSectionTitle = (sec: AdminSection) => {
    switch (sec) {
      case 'dashboard': return 'Dashboard Overview';
      case 'approvals': return 'Pending Member Approvals';
      case 'members': return 'Member Directory & Badges';
      case 'preregister': return 'Pre-Register Member';
      case 'dues': return 'Dues Ledger & Invoicing';
      case 'expenses': return 'Expense Claims & Approvals';
      case 'events': return 'Events & Transparency Budgets';
      case 'celebrations': return 'Birthdays & Anniversaries';
      case 'logs': return 'Security & Audit Logs';
      default: return 'Administration';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/90 shadow-xs">
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Hamburger + Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-lg">
          <button
            onClick={onToggleSidebar}
            title="Toggle Sidebar"
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Box with Ctrl / badge */}
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search members, dues, expenses..."
              className="w-full pl-9 pr-14 py-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder-gray-400 text-gray-800"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 bg-gray-200/80 px-1.5 py-0.5 rounded border border-gray-300">
              Ctrl /
            </span>
          </div>
        </div>

        {/* Right Side: Clean Active Action Badges & User Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              title="Notifications"
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white animate-pulse">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800">Pending Actions</span>
                  <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    {pendingApprovalsCount + pendingExpensesCount} New
                  </span>
                </div>
                <div className="py-2 space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-900 flex items-center justify-between">
                    <span>Member Approvals</span>
                    <span className="font-extrabold">{pendingApprovalsCount} pending</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-900 flex items-center justify-between">
                    <span>Expense Claims</span>
                    <span className="font-extrabold">{pendingExpensesCount} pending</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Light/Dark mode) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {/* Super Admin User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <div className="relative">
                <UserAvatar
                  member={currentUser}
                  className="w-8 h-8 ring-2 ring-indigo-600/30"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="text-xs font-bold text-gray-900 truncate">{currentUser?.name || 'Super Admin'}</div>
                  <div className="text-[11px] text-gray-500 truncate">{currentUser?.email || 'superadmin@gmail.com'}</div>
                  <span className="inline-block mt-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    SUPER ADMIN
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleSignOut();
                      navigate('/admin/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition font-bold text-xs cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CoreUI Breadcrumbs Bar */}
      <div className="bg-[#f8f9fa] border-t border-gray-200/60 px-4 sm:px-6 py-2 flex items-center gap-2 text-xs font-medium text-gray-500">
        <span className="text-gray-500 font-semibold">Admin Suite</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-800 font-bold">{getSectionTitle(activeSection)}</span>
      </div>
    </header>
  );
};
