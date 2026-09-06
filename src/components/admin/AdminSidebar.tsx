import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  UserPlus, 
  CreditCard as CreditCardIcon, 
  Wallet, 
  CalendarDays, 
  Cake, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  LucideIcon
} from 'lucide-react';

export type AdminSection = 
  | 'dashboard'
  | 'approvals'
  | 'members'
  | 'preregister'
  | 'dues'
  | 'expenses'
  | 'events'
  | 'celebrations'
  | 'logs';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  count?: number;
  countColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  pendingApprovalsCount: number;
  pendingExpensesCount: number;
  totalMembersCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSelectSection,
  pendingApprovalsCount,
  pendingExpensesCount,
  totalMembersCount,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { currentUser } = useAuth();

  const navGroups: NavGroup[] = [
    {
      title: 'CORE',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: 'NEW',
          badgeColor: 'bg-blue-500 text-white',
        },
      ],
    },
    {
      title: 'USER GOVERNANCE',
      items: [
        {
          id: 'approvals',
          label: 'Pending Approvals',
          icon: Clock,
          count: pendingApprovalsCount,
          countColor: 'bg-amber-500 text-black font-bold',
        },
        {
          id: 'members',
          label: 'Member Directory',
          icon: Users,
          count: totalMembersCount,
          countColor: 'bg-gray-700 text-gray-200',
        },
        {
          id: 'preregister',
          label: 'Pre-Register Member',
          icon: UserPlus,
        },
      ],
    },
    {
      title: 'FINANCIAL SUITE',
      items: [
        {
          id: 'dues',
          label: 'Dues & Invoicing',
          icon: CreditCardIcon,
        },
        {
          id: 'expenses',
          label: 'Expense Claims',
          icon: Wallet,
          count: pendingExpensesCount,
          countColor: 'bg-rose-500 text-white font-bold',
        },
      ],
    },
    {
      title: 'EVENTS & ENGAGEMENT',
      items: [
        {
          id: 'events',
          label: 'Events & Budgets',
          icon: CalendarDays,
        },
        {
          id: 'celebrations',
          label: 'Birthdays & Wishes',
          icon: Cake,
        },
      ],
    },
    {
      title: 'SYSTEM & AUDIT',
      items: [
        {
          id: 'logs',
          label: 'Security & Audit Logs',
          icon: ShieldCheck,
        },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#212631] text-gray-300 flex flex-col h-screen max-h-screen sticky top-0 overflow-hidden transition-all duration-300 ease-in-out border-r border-[#2d3446] shrink-0 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header Brand Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#2d3446] bg-[#1d222b]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Hexagon Logo Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0 ring-2 ring-indigo-400/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white tracking-wide truncate">
                  CLUBSPHERE
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-indigo-600/60 text-indigo-200 border border-indigo-500/40">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium truncate">
                Admin Governance
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#2d3446] transition hidden lg:block cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                {group.title}
              </div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group cursor-pointer ${
                      isActive
                        ? 'bg-[#2d3446] text-white shadow-sm font-bold border-l-4 border-indigo-500'
                        : 'text-gray-300 hover:bg-[#2a303f] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-gray-200'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wide ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && item.count > 0 && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${item.countColor || 'bg-gray-700 text-gray-200'}`}>
                            {item.count}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer (Collapse Toggle) */}
      <div className="p-3 border-t border-[#2d3446] bg-[#1d222b]">
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#2a303f] hover:bg-[#32394a] text-gray-300 hover:text-white text-xs font-bold transition border border-[#373f52] cursor-pointer ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
            {!isCollapsed && <span>Admin Suite 2.0</span>}
          </div>
          {!isCollapsed && (
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </aside>
  );
};
