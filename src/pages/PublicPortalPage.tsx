import React from 'react';
import { useAppSelector } from '../store';
import { Navbar } from '../components/Navbar';
import { CelebrationBanner } from '../components/CelebrationBanner';
import { PendingVerificationNotice } from '../components/PendingVerificationNotice';
import { DirectoryTab } from '../components/tabs/DirectoryTab';
import { DuesTab } from '../components/tabs/DuesTab';
import { ExpensesTab } from '../components/tabs/ExpensesTab';
import { EventsTab } from '../components/tabs/EventsTab';

// Modals
import { ProfileEditModal } from '../components/ProfileEditModal';
import { MemberDetailModal } from '../components/MemberDetailModal';
import { MarkPaidModal } from '../components/MarkPaidModal';
import { SubmitExpenseModal } from '../components/SubmitExpenseModal';
import { EventDetailModal } from '../components/EventDetailModal';
import { NotificationToasts } from '../components/NotificationToasts';
import { MobileBottomNav } from '../components/MobileBottomNav';

import { useAuth } from '../hooks/useAuth';

export const PublicPortalPage: React.FC = () => {
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const { isPending } = useAuth();

  // If member is awaiting Admin approval, show the dedicated Full-Screen Approval holding screen (without main navbar)
  if (isPending) {
    return (
      <div className="min-h-screen bg-white text-gray-900 selection:bg-indigo-600 selection:text-white flex flex-col">
        <main className="flex-1 w-full flex flex-col">
          <PendingVerificationNotice />
        </main>
        {/* Toast Notification Container */}
        <NotificationToasts />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white sm:bg-[#f8f9fc] text-gray-900 selection:bg-indigo-600 selection:text-white pb-20 md:pb-0">
      {/* Main Luxury Navigation Bar (Only for verified members) */}
      <Navbar />

      {/* Celebrations Widget for Today's Birthdays & Anniversaries */}
      <CelebrationBanner />

      {/* Main Content Area with Member Tabs */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Tab Routing */}
        {activeTab === 'directory' && <DirectoryTab />}
        {activeTab === 'dues' && <DuesTab />}
        {activeTab === 'expenses' && <ExpensesTab />}
        {activeTab === 'events' && <EventsTab />}
      </main>

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* All Global Modals */}
      <ProfileEditModal />
      <MemberDetailModal />
      <MarkPaidModal />
      <SubmitExpenseModal />
      <EventDetailModal />

      {/* Toast Notification Container */}
      <NotificationToasts />
    </div>
  );
};

export default PublicPortalPage;
