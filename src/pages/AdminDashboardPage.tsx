import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '../store';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminSidebar, AdminSection } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminTab } from '../components/tabs/AdminTab';
import { PreAddMemberModal } from '../components/PreAddMemberModal';
import { MarkPaidModal } from '../components/MarkPaidModal';
import { NotificationToasts } from '../components/NotificationToasts';

export const AdminDashboardPage: React.FC = () => {
  const { role, isVerified } = useAuth();
  const members = useAppSelector((state) => state.members.members);
  const expenses = useAppSelector((state) => state.expenses.expenses);

  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isIssueDuesOpen, setIsIssueDuesOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const pendingApprovalsCount = members.filter((m) => m.verificationStatus === 'PENDING_APPROVAL').length;
  const pendingExpensesCount = expenses.filter((e) => e.status === 'PENDING_APPROVAL').length;
  const totalMembersCount = members.filter((m) => m.verificationStatus === 'VERIFIED').length;

  const isAdmin = role === 'ADMIN' && isVerified;

  // If not admin, show Admin Login Page
  if (!isAdmin) {
    return <AdminLoginPage />;
  }

  return (
    <div className="h-screen w-screen flex bg-[#f3f4f7] text-gray-900 font-sans antialiased selection:bg-indigo-600 selection:text-white overflow-hidden fixed inset-0">
      {/* 1. Left CoreUI Pro Dark Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        pendingApprovalsCount={pendingApprovalsCount}
        pendingExpensesCount={pendingExpensesCount}
        totalMembersCount={totalMembersCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Navbar with Breadcrumbs */}
        <AdminHeader
          activeSection={activeSection}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          pendingApprovalsCount={pendingApprovalsCount}
          pendingExpensesCount={pendingExpensesCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Page Body - Only this container scrolls */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 custom-scrollbar">
          {/* Active Admin Section Content */}
          <AdminTab
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            searchQuery={searchQuery}
            isIssueDuesOpen={isIssueDuesOpen}
            setIsIssueDuesOpen={setIsIssueDuesOpen}
            isCreateEventOpen={isCreateEventOpen}
            setIsCreateEventOpen={setIsCreateEventOpen}
          />
        </main>
      </div>

      {/* Global Modals for Admin */}
      <PreAddMemberModal />
      <MarkPaidModal />
      <NotificationToasts />
    </div>
  );
};

export default AdminDashboardPage;
