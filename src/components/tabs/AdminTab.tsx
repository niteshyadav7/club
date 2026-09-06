import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  verifyMember, 
  rejectMember, 
  deleteMember, 
  updateMemberRole, 
  updateMemberBadges, 
  addNewCustomBadge, 
  addMemberByPhone 
} from '../../store/slices/membersSlice';
import { markDueAsPaid, deleteDueRecord } from '../../store/slices/duesSlice';
import { approveExpenseRequest, rejectExpenseRequest, deleteExpense, addNewCategory } from '../../store/slices/expensesSlice';
import { deleteEvent } from '../../store/slices/eventsSlice';
import { addAuditLog } from '../../store/slices/auditSlice';
import { addToast } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import { IssueDuesModal } from '../IssueDuesModal';
import { CreateEventModal } from '../CreateEventModal';
import { Member, UserRole } from '../../types';
import { AdminSection } from '../admin/AdminSidebar';
import { UserAvatar } from '../UserAvatar';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Trash2, 
  Receipt, 
  Wallet, 
  CalendarDays, 
  Activity, 
  Plus, 
  Search, 
  FileText, 
  Filter,
  Eye,
  Settings,
  ChevronRight,
  TrendingUp,
  Tag,
  Cake,
  PartyPopper,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  CheckSquare,
  CreditCard,
  Image,
  Briefcase,
  Building,
  Calendar,
  Layers,
  Heart,
  ChevronUp,
  ChevronDown,
  Wand2,
  RefreshCw,
  QrCode,
  Shield,
  SlidersHorizontal,
  Check
} from 'lucide-react';

interface AdminTabProps {
  activeSection: AdminSection;
  onSelectSection: (sec: AdminSection) => void;
  searchQuery: string;
  isIssueDuesOpen: boolean;
  setIsIssueDuesOpen: (open: boolean) => void;
  isCreateEventOpen: boolean;
  setIsCreateEventOpen: (open: boolean) => void;
}

export type FieldDataType = 'text' | 'number' | 'date' | 'select' | 'boolean';

export interface DynamicFieldItem {
  id: string;
  label: string;
  value: string;
  type: FieldDataType;
  options?: string[];
}

interface FieldSuggestion {
  label: string;
  type: FieldDataType;
  defaultValue?: string;
  options?: string[];
  icon: string;
}

const FIELD_SUGGESTIONS: FieldSuggestion[] = [
  { label: 'Spouse Name', type: 'text', defaultValue: 'Radhika Sharma', icon: '💍' },
  { label: 'Golf Handicap', type: 'number', defaultValue: '8', icon: '⛳' },
  { label: 'Vehicle Number', type: 'text', defaultValue: 'MH01 AB 1234', icon: '🚗' },
  { label: 'Emergency Contact', type: 'text', defaultValue: '+91 98200 99999', icon: '🚨' },
  { label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], defaultValue: 'O+', icon: '🩸' },
  { label: 'Dietary Preference', type: 'select', options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Eggetarian', 'Gluten-Free'], defaultValue: 'Vegetarian', icon: '🥗' },
  { label: 'Locker Number', type: 'text', defaultValue: 'L-204', icon: '🔐' },
  { label: 'LinkedIn Profile', type: 'text', defaultValue: 'https://linkedin.com/in/rahulsharma', icon: '💼' },
  { label: 'VIP Valet Parking', type: 'boolean', defaultValue: 'Yes', options: ['Yes', 'No'], icon: '🅿️' },
  { label: 'Gym & Spa Locker', type: 'boolean', defaultValue: 'Yes', options: ['Yes', 'No'], icon: '🏋️' },
  { label: 'Yacht / Boat Berth #', type: 'text', defaultValue: 'Berth-42', icon: '⛵' },
  { label: 'National ID / Passport', type: 'text', defaultValue: 'Z1234567', icon: '🪪' },
  { label: 'Preferred Tee Time', type: 'select', options: ['Early Morning (6 AM - 8 AM)', 'Morning (8 AM - 11 AM)', 'Afternoon (2 PM - 5 PM)', 'Twilight (5 PM - 7 PM)'], defaultValue: 'Early Morning (6 AM - 8 AM)', icon: '🏌️' },
  { label: 'Secondary Phone', type: 'text', defaultValue: '+91 98201 11223', icon: '📱' },
];

const PRESET_AVATARS = [
  { label: 'Gentleman 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Lady 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Gentleman 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Lady 2', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Youth', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
];

export const AdminTab: React.FC<AdminTabProps> = ({
  activeSection,
  onSelectSection,
  searchQuery,
  isIssueDuesOpen,
  setIsIssueDuesOpen,
  isCreateEventOpen,
  setIsCreateEventOpen,
}) => {
  const dispatch = useAppDispatch();
  const { members, availableBadges } = useAppSelector((state) => state.members);
  const dues = useAppSelector((state) => state.dues.dues);
  const { expenses, availableCategories, totalBudgetLimit } = useAppSelector((state) => state.expenses);
  const events = useAppSelector((state) => state.events.events);
  const wishes = useAppSelector((state) => state.celebrations.wishes);
  const auditLogs = useAppSelector((state) => state.audit.logs);
  const { currentUser } = useAuth();

  // Dynamic filter states
  const [memberFilterRole, setMemberFilterRole] = useState<string>('ALL');
  const [newBadgeName, setNewBadgeName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Enhanced Pre-registration form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhotoUrl, setRegPhotoUrl] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Mumbai');
  const [regBio, setRegBio] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('GENERAL_MEMBER');
  const [regBadges, setRegBadges] = useState<string[]>(['VIP Member']);
  const [regOccupation, setRegOccupation] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regBirthday, setRegBirthday] = useState('');
  const [regAnniversary, setRegAnniversary] = useState('');
  const [customBadgeInput, setCustomBadgeInput] = useState('');

  // Dynamic Custom Fields State
  const [dynamicFields, setDynamicFields] = useState<DynamicFieldItem[]>([
    { id: 'df-1', label: 'Spouse Name', value: 'Ananya Sharma', type: 'text' },
    { id: 'df-2', label: 'Golf Handicap', value: '6', type: 'number' },
    { id: 'df-3', label: 'Blood Group', value: 'O+', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
  ]);

  const addDynamicField = (label = '', value = '', type: FieldDataType = 'text', options?: string[]) => {
    setDynamicFields((prev) => [
      ...prev,
      {
        id: `df-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        label: label || `Custom Field ${prev.length + 1}`,
        value,
        type,
        options: options || (type === 'boolean' ? ['Yes', 'No'] : undefined)
      }
    ]);
  };

  const removeDynamicField = (id: string) => {
    setDynamicFields((prev) => prev.filter((f) => f.id !== id));
  };

  const updateDynamicField = (id: string, updates: Partial<DynamicFieldItem>) => {
    setDynamicFields((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const moveDynamicField = (index: number, direction: 'up' | 'down') => {
    setDynamicFields((prev) => {
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  const handleAutofillDemo = () => {
    setRegName('Aditya Pratap Oberoi');
    setRegPhone('+91 98202 77889');
    setRegEmail('aditya.oberoi@oberoiholdings.com');
    setRegPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80');
    setRegCity('Mumbai');
    setRegAddress('Sky Villa 42, Altamount Road, Cumballa Hill');
    setRegRole('CORE_MEMBER');
    setRegBadges(['Founding Member', 'VIP Member', 'Event Organizer']);
    setRegOccupation('Managing Director & Venture Partner');
    setRegCompany('Oberoi Horizon Capital');
    setRegBirthday('1986-04-18');
    setRegAnniversary('2014-11-28');
    setRegBio('Passionate avid golfer (+3 handicap), classic automotive collector, and founding sponsor for youth championships.');
    setDynamicFields([
      { id: 'df-demo-1', label: 'Spouse Name', value: 'Radhika Oberoi', type: 'text' },
      { id: 'df-demo-2', label: 'Golf Handicap', value: '3', type: 'number' },
      { id: 'df-demo-3', label: 'Vehicle Number', value: 'MH01 EA 0007', type: 'text' },
      { id: 'df-demo-4', label: 'Blood Group', value: 'O+', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
      { id: 'df-demo-5', label: 'Dietary Preference', value: 'Vegetarian', type: 'select', options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Eggetarian', 'Gluten-Free'] },
      { id: 'df-demo-6', label: 'Locker Number', value: 'Suite #07', type: 'text' },
      { id: 'df-demo-7', label: 'VIP Valet Parking', value: 'Yes', type: 'boolean', options: ['Yes', 'No'] },
    ]);
    dispatch(addToast({ title: 'Sample VIP Profile Loaded! ⚡', message: 'Demo member with dynamic custom fields loaded.', type: 'info' }));
  };

  const handleClearForm = () => {
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegPhotoUrl('');
    setRegAddress('');
    setRegCity('Mumbai');
    setRegBio('');
    setRegRole('GENERAL_MEMBER');
    setRegBadges(['VIP Member']);
    setRegOccupation('');
    setRegCompany('');
    setRegBirthday('');
    setRegAnniversary('');
    setDynamicFields([]);
    dispatch(addToast({ title: 'Form Cleared', message: 'Ready for new member entry.', type: 'info' }));
  };

  const toggleBadge = (badge: string) => {
    if (regBadges.includes(badge)) {
      setRegBadges(regBadges.filter((b) => b !== badge));
    } else {
      setRegBadges([...regBadges, badge]);
    }
  };

  const handleCreateCustomBadge = () => {
    const trimmed = customBadgeInput.trim();
    if (trimmed) {
      dispatch(addNewCustomBadge(trimmed));
      if (!regBadges.includes(trimmed)) {
        setRegBadges([...regBadges, trimmed]);
      }
      setCustomBadgeInput('');
      dispatch(addToast({ title: 'Badge Added', message: `Custom badge "${trimmed}" created.`, type: 'info' }));
    }
  };

  const pendingMembers = members.filter((m) => m.verificationStatus === 'PENDING_APPROVAL' && m.role !== 'ADMIN' && m.email?.toLowerCase().trim() !== 'superadmin@gmail.com');
  const verifiedMembers = members.filter((m) => m.verificationStatus === 'VERIFIED');
  const pendingExpenses = expenses.filter((e) => e.status === 'PENDING_APPROVAL');
  const approvedExpenses = expenses.filter((e) => e.status === 'APPROVED');
  const totalExpensesSpent = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);

  const paidDues = dues.filter((d) => d.status === 'PAID');
  const totalDuesCollected = paidDues.reduce((sum, d) => sum + d.amount, 0);
  const pendingDues = dues.filter((d) => d.status === 'PENDING' || d.status === 'OVERDUE');
  const totalDuesOutstanding = pendingDues.reduce((sum, d) => sum + d.amount, 0);

  // Member Approval Handlers
  const handleApproveApplicant = (applicant: Member, role: UserRole = 'GENERAL_MEMBER') => {
    dispatch(verifyMember({
      memberId: applicant.id,
      role,
      badges: ['Star Contributor', 'VIP Member']
    }));

    dispatch(addAuditLog({
      action: 'Verified Member Account',
      performedBy: `${currentUser?.name || 'Super Admin'} (Admin)`,
      target: `${applicant.name} (${role.replace('_', ' ')})`,
      type: 'MEMBER'
    }));

    dispatch(addToast({
      title: 'Member Verified! 🎉',
      message: `${applicant.name} verified as ${role.replace('_', ' ')}.`,
      type: 'success'
    }));
  };

  const handleRejectApplicant = (applicant: Member) => {
    dispatch(rejectMember({ memberId: applicant.id }));

    dispatch(addAuditLog({
      action: 'Declined Member Account',
      performedBy: `${currentUser?.name || 'Super Admin'} (Admin)`,
      target: `${applicant.name} (Rejected)`,
      type: 'MEMBER'
    }));

    dispatch(addToast({
      title: 'Applicant Declined',
      message: `${applicant.name}'s request was declined.`,
      type: 'warning'
    }));
  };

  // Pre-Registration Submit Handler with Dynamic Fields
  const handlePreAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) {
      dispatch(addToast({ title: 'Validation Error', message: 'Full Name and Phone Number are mandatory.', type: 'error' }));
      return;
    }

    // Convert dynamic fields array into dictionary object
    const customFieldsObj: Record<string, string> = {};
    dynamicFields.forEach((df) => {
      const k = df.label.trim();
      if (k && df.value.trim()) {
        customFieldsObj[k] = df.value.trim();
      }
    });

    dispatch(addMemberByPhone({
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || `${regName.trim().toLowerCase().replace(/\s+/g, '.')}@club.org`,
      photoUrl: regPhotoUrl.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      address: regAddress.trim() || 'Address on file',
      city: regCity.trim() || 'Mumbai',
      bio: regBio.trim() || 'Pre-registered club member.',
      role: regRole,
      badges: regBadges,
      occupation: regOccupation.trim() || undefined,
      company: regCompany.trim() || undefined,
      birthday: regBirthday || '1990-01-01',
      anniversary: regAnniversary || undefined,
      customFields: customFieldsObj
    }));

    dispatch(addAuditLog({
      action: 'Pre-Registered Member via Phone',
      performedBy: `${currentUser?.name || 'Super Admin'} (Admin)`,
      target: `${regName} (${regPhone}) - ${regRole}`,
      type: 'MEMBER'
    }));

    triggerConfetti();

    dispatch(addToast({
      title: 'Member Pre-Registered! 🛡️',
      message: `${regName} added to system with verified status and custom fields.`,
      type: 'success'
    }));

    // Reset Form
    handleClearForm();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: CORE OVERVIEW DASHBOARD */}
      {activeSection === 'dashboard' && (
        <div className="space-y-6">
          {/* CoreUI Stat Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Members</span>
                <div className="text-2xl font-black text-gray-900">{verifiedMembers.length}</div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{members.length} total registered</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pending Signups</span>
                <div className="text-2xl font-black text-amber-600">{pendingMembers.length}</div>
                <div className="text-[11px] text-gray-500 font-medium">Awaiting admin review</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Dues Collected</span>
                <div className="text-2xl font-black text-emerald-700">₹{totalDuesCollected.toLocaleString()}</div>
                <div className="text-[11px] text-rose-600 font-medium">₹{totalDuesOutstanding.toLocaleString()} pending</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Approved Expenses</span>
                <div className="text-2xl font-black text-purple-700">₹{totalExpensesSpent.toLocaleString()}</div>
                <div className="text-[11px] text-gray-500 font-medium">{pendingExpenses.length} claims pending</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Action Hub & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Pending Approvals Table Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-extrabold text-gray-900">Pending Member Queue</h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {pendingMembers.length}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectSection('approvals')}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 divide-y divide-gray-100">
                  {pendingMembers.length > 0 ? (
                    pendingMembers.slice(0, 4).map((m) => (
                      <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            member={m}
                            className="w-9 h-9 ring-1 ring-gray-200"
                          />
                          <div>
                            <div className="text-xs font-extrabold text-gray-900">{m.name}</div>
                            <div className="text-[11px] text-gray-500">{m.email} • {m.phone || 'No phone'}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveApplicant(m, 'GENERAL_MEMBER')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectApplicant(m)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold transition cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-xs">
                      No pending signups. All member requests are cleared! ✨
                    </div>
                  )}
                </div>
              </div>

              {/* Dues Summary Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-extrabold text-gray-900">Recent Dues Invoices</h4>
                  </div>
                  <button
                    onClick={() => onSelectSection('dues')}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Dues</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 divide-y divide-gray-100 text-xs">
                  {dues.slice(0, 4).map((d) => (
                    <div key={d.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-gray-900">{d.memberName}</span>
                        <div className="text-[11px] text-gray-500">{d.period} • Due: {d.dueDate}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-gray-900">₹{d.amount.toLocaleString()}</span>
                        <div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {d.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Quick Governance Shortcuts */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                <h4 className="text-sm font-extrabold text-gray-900 pb-2 border-b border-gray-100">
                  Admin Action Console
                </h4>

                <div className="space-y-2.5">
                  <button
                    onClick={() => onSelectSection('preregister')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-indigo-50/60 border border-gray-200 hover:border-indigo-300 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-700">Pre-Add Phone Member</div>
                        <div className="text-[10px] text-gray-500">With dynamic custom fields</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                  </button>

                  <button
                    onClick={() => setIsIssueDuesOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-300 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-700">Issue Dues Invoice</div>
                        <div className="text-[10px] text-gray-500">Bill members for annual dues</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
                  </button>

                  <button
                    onClick={() => setIsCreateEventOpen(true)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-purple-50/60 border border-gray-200 hover:border-purple-300 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 group-hover:text-purple-700">Publish Club Event</div>
                        <div className="text-[10px] text-gray-500">With itemized spend breakdown</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                  </button>
                </div>
              </div>

              {/* System Audit Feed Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-sm font-extrabold text-gray-900">Governance Audit Trail</h4>
                  </div>
                  <button
                    onClick={() => onSelectSection('logs')}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Logs
                  </button>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px]">
                      <div className="font-extrabold text-gray-900">{log.action}</div>
                      <div className="text-gray-500 mt-0.5 truncate">{log.target}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{log.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PENDING APPROVALS */}
      {activeSection === 'approvals' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Pending Member Verification Queue ({pendingMembers.length})
              </h3>
              <p className="text-xs text-gray-500">Applicants registered via Google OAuth awaiting Super Admin verification</p>
            </div>
          </div>

          {pendingMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingMembers.map((m) => (
                <div key={m.id} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <UserAvatar
                      member={m}
                      className="w-12 h-12 rounded-2xl ring-2 ring-amber-300"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold text-gray-900 truncate">{m.name}</div>
                      <div className="text-xs text-gray-600 truncate">{m.email}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{m.phone || 'No phone provided'} • {m.city || 'City not set'}</div>
                      {m.bio && <p className="text-xs text-gray-600 mt-2 bg-white/70 p-2 rounded-xl border border-amber-200/60 line-clamp-2">{m.bio}</p>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleApproveApplicant(m, 'GENERAL_MEMBER')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        Approve (General)
                      </button>
                      <button
                        onClick={() => handleApproveApplicant(m, 'CORE_MEMBER')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        Approve (Core)
                      </button>
                    </div>

                    <button
                      onClick={() => handleRejectApplicant(m)}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-gray-900">Zero Pending Signups</h3>
              <p className="text-xs text-gray-500 mt-1">All applicant registrations are verified and up to date.</p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: MEMBERS DIRECTORY & BADGES */}
      {activeSection === 'members' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Member Directory & Badges Manager ({verifiedMembers.length})
              </h3>
              <p className="text-xs text-gray-500">Manage member privileges, roles, and assign custom recognition badges</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={memberFilterRole}
                onChange={(e) => setMemberFilterRole(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-gray-50 font-bold text-gray-700 focus:outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Super Admins</option>
                <option value="CORE_MEMBER">Core Members</option>
                <option value="GENERAL_MEMBER">General Members</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Badges</th>
                  <th className="p-3">Custom Fields</th>
                  <th className="p-3">City & Contact</th>
                  <th className="p-3">Dues</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {verifiedMembers
                  .filter((m) => memberFilterRole === 'ALL' || m.role === memberFilterRole)
                  .filter((m) => searchQuery === '' || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/80 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            member={m}
                            className="w-9 h-9 ring-1 ring-gray-200"
                          />
                          <div>
                            <div className="font-extrabold text-gray-900">{m.name}</div>
                            <div className="text-[11px] text-gray-500">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={m.role}
                          onChange={(e) => dispatch(updateMemberRole({ memberId: m.id, role: e.target.value as UserRole }))}
                          className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold bg-white focus:outline-none"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="CORE_MEMBER">Core Member</option>
                          <option value="GENERAL_MEMBER">General Member</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {m.badges?.map((b) => (
                            <span key={b} className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        {m.customFields && Object.keys(m.customFields).length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {Object.entries(m.customFields).map(([k, v]) => (
                              <span key={k} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <span className="text-gray-500">{k}:</span> {v}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-3 text-gray-600">
                        <div>{m.city || 'Mumbai'}</div>
                        <div className="text-[11px] text-gray-400">{m.phone || 'No phone'}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.duesStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.duesStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove member ${m.name}?`)) {
                              dispatch(deleteMember(m.id));
                              dispatch(addToast({ title: 'Member Deleted', message: `${m.name} removed.`, type: 'warning' }));
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: HIGHLY REFINED PRE-REGISTER WITH DYNAMIC FIELDS BUILDER */}
      {activeSection === 'preregister' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Banner Toolbar */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
                  <UserPlus className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      Pre-Register Member Suite
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Firestore DB
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Directly onboard verified members into Firestore with custom dynamic fields, badges, and role privileges
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Populate realistic sample VIP member with custom dynamic fields"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Autofill Sample VIP Member</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearForm}
                  className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Clear all fields"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>
              </div>
            </div>
          </div>

          {/* Master 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: The Rich Pre-Registration & Dynamic Builder Form */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <form onSubmit={handlePreAddSubmit} className="space-y-6">
                {/* SUB-SECTION 1: Core Contact & Identity */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900">
                          Personal Identity & Contact Info
                        </h4>
                        <p className="text-[11px] text-gray-400">Primary member contact and residential address</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98200 12345"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50/50 focus:bg-white font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50/50 focus:bg-white font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="rahul@example.com"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50/50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          placeholder="e.g. Mumbai"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50/50 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Residential Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="Apartment, Wing, Street, Area"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50/50 focus:bg-white"
                    />
                  </div>

                  {/* Photo Avatar URL & Quick Presets */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Profile Avatar / Photo URL
                    </label>
                    <div className="relative mb-2">
                      <Image className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={regPhotoUrl}
                        onChange={(e) => setRegPhotoUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50/50 focus:bg-white"
                      />
                    </div>

                    {/* Quick Avatar Pickers */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Quick Pick:
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {PRESET_AVATARS.map((av) => (
                          <button
                            key={av.label}
                            type="button"
                            onClick={() => setRegPhotoUrl(av.url)}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] transition cursor-pointer shrink-0 ${
                              regPhotoUrl === av.url
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <img src={av.url} alt={av.label} className="w-4 h-4 rounded-full object-cover" />
                            <span>{av.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUB-SECTION 2: Roles & Recognition Badges */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900">
                          Role Privileges & Recognition Badges
                        </h4>
                        <p className="text-[11px] text-gray-400">Set permissions and honorific badges for the member</p>
                      </div>
                    </div>
                  </div>

                  {/* Role Selector Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'GENERAL_MEMBER' as UserRole, title: 'General Member', desc: 'Directory, Dues, Events' },
                      { id: 'CORE_MEMBER' as UserRole, title: 'Core Member', desc: 'Expense Claims & Events' },
                      { id: 'ADMIN' as UserRole, title: 'Super Admin', desc: 'Full Verification Authority' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRegRole(r.id)}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                          regRole === r.id
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black ${regRole === r.id ? 'text-indigo-950' : 'text-gray-800'}`}>
                            {r.title}
                          </span>
                          {regRole === r.id && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{r.desc}</p>
                      </button>
                    ))}
                  </div>

                  {/* Badge Chips Picker */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Assign Recognition Badges</label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableBadges.map((badge) => {
                        const isSelected = regBadges.includes(badge);
                        return (
                          <button
                            key={badge}
                            type="button"
                            onClick={() => toggleBadge(badge)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {badge}
                          </button>
                        );
                      })}
                    </div>

                    {/* Inline Add Custom Badge */}
                    <div className="mt-3 flex items-center gap-2 max-w-sm">
                      <input
                        type="text"
                        value={customBadgeInput}
                        onChange={(e) => setCustomBadgeInput(e.target.value)}
                        placeholder="Create new custom badge..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50/50"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCustomBadge}
                        className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold transition shrink-0 cursor-pointer"
                      >
                        + Add Badge
                      </button>
                    </div>
                  </div>
                </div>

                {/* SUB-SECTION 3: Dates & Profession */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900">
                          Milestones & Professional Background
                        </h4>
                        <p className="text-[11px] text-gray-400">Celebration triggers and career information</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Birthday (Wishes)</label>
                      <input
                        type="date"
                        value={regBirthday}
                        onChange={(e) => setRegBirthday(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Anniversary</label>
                      <input
                        type="date"
                        value={regAnniversary}
                        onChange={(e) => setRegAnniversary(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Occupation / Profession</label>
                      <input
                        type="text"
                        value={regOccupation}
                        onChange={(e) => setRegOccupation(e.target.value)}
                        placeholder="e.g. Managing Director"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Company / Enterprise</label>
                      <input
                        type="text"
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        placeholder="e.g. Singhania Capital"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">About Yourself / Bio Snippet</label>
                    <textarea
                      rows={2}
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="Brief member background, sports passions, luxury real estate or philanthropic interests..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* SUB-SECTION 4: DYNAMIC CUSTOM FIELDS BUILDER (Primary Feature Requested) */}
                <div className="bg-gradient-to-br from-[#f8faff] via-white to-[#f0f4ff] rounded-3xl border-2 border-indigo-200/80 p-6 sm:p-7 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-sm shadow-indigo-500/30">
                        4
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                          Dynamic Custom Fields Builder
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                            {dynamicFields.length} Active {dynamicFields.length === 1 ? 'Field' : 'Fields'}
                          </span>
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          Add any custom attributes dynamically (e.g. Spouse Name, Golf Handicap, Vehicle Number, Locker #, Blood Group, VIP Valet)
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addDynamicField('', '', 'text')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 shrink-0 cursor-pointer active:scale-98"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Custom Field</span>
                    </button>
                  </div>

                  {/* Quick Preset Suggestion Tags */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                      Quick Suggestion Presets (Click to Add):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {FIELD_SUGGESTIONS.map((sugg) => (
                        <button
                          key={sugg.label}
                          type="button"
                          onClick={() => addDynamicField(sugg.label, sugg.defaultValue || '', sugg.type, sugg.options)}
                          className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-white border border-indigo-200/90 text-indigo-800 hover:bg-indigo-50 hover:border-indigo-400 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <span>{sugg.icon}</span>
                          <span>+ {sugg.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Rows List */}
                  {dynamicFields.length > 0 ? (
                    <div className="space-y-3 pt-1">
                      {dynamicFields.map((field, idx) => (
                        <div
                          key={field.id}
                          className="p-4 bg-white rounded-2xl border border-indigo-200/80 shadow-xs space-y-3 animate-in fade-in zoom-in-95 duration-150"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-[11px] font-black shrink-0">
                                #{idx + 1}
                              </span>
                              <span className="text-xs font-bold text-gray-700">Custom Attribute</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Move Up */}
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveDynamicField(idx, 'up')}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                title="Move Up"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>

                              {/* Move Down */}
                              <button
                                type="button"
                                disabled={idx === dynamicFields.length - 1}
                                onClick={() => moveDynamicField(idx, 'down')}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                title="Move Down"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => removeDynamicField(field.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete this custom field"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            {/* Field Type Selector */}
                            <div className="sm:col-span-3">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                Data Type
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) => {
                                  const newType = e.target.value as FieldDataType;
                                  updateDynamicField(field.id, {
                                    type: newType,
                                    value: newType === 'boolean' ? 'Yes' : field.value,
                                    options: newType === 'boolean' ? ['Yes', 'No'] : field.options
                                  });
                                }}
                                className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800"
                              >
                                <option value="text">Text (String)</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="select">Dropdown / Select</option>
                                <option value="boolean">Yes / No Toggle</option>
                              </select>
                            </div>

                            {/* Field Label / Name */}
                            <div className="sm:col-span-4">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                Field Name / Label
                              </label>
                              <input
                                type="text"
                                required
                                value={field.label}
                                onChange={(e) => updateDynamicField(field.id, { label: e.target.value })}
                                placeholder="e.g. Golf Handicap"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 bg-white"
                              />
                            </div>

                            {/* Field Value Smart Input */}
                            <div className="sm:col-span-5">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                Field Value
                              </label>

                              {field.type === 'boolean' ? (
                                <div className="flex items-center gap-2">
                                  {['Yes', 'No'].map((opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => updateDynamicField(field.id, { value: opt })}
                                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                        field.value === opt
                                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              ) : field.type === 'date' ? (
                                <input
                                  type="date"
                                  required
                                  value={field.value}
                                  onChange={(e) => updateDynamicField(field.id, { value: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900"
                                />
                              ) : field.type === 'number' ? (
                                <input
                                  type="number"
                                  required
                                  value={field.value}
                                  onChange={(e) => updateDynamicField(field.id, { value: e.target.value })}
                                  placeholder="e.g. 12"
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900 font-medium"
                                />
                              ) : field.type === 'select' && field.options && field.options.length > 0 ? (
                                <select
                                  value={field.value || field.options[0]}
                                  onChange={(e) => updateDynamicField(field.id, { value: e.target.value })}
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900 font-medium"
                                >
                                  {field.options.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  required
                                  value={field.value}
                                  onChange={(e) => updateDynamicField(field.id, { value: e.target.value })}
                                  placeholder="Enter value..."
                                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-900"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-indigo-200 p-6">
                      <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-80" />
                      <h4 className="text-xs font-bold text-gray-700">No dynamic custom fields added yet</h4>
                      <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">
                        Click <strong>"+ Add Custom Field"</strong> or select one of the quick presets above to add custom club attributes.
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit & Save Bar */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-gray-900">Immediate Verification</div>
                      <div className="text-[11px] text-gray-500">
                        Member will be added as <strong>VERIFIED</strong> with full privileges in Firestore.
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-black tracking-wide transition shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>✨ Pre-Register & Save Member to DB</span>
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: Sticky Real-Time Live Club Privilege Card Preview */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-4">
              <div className="bg-gradient-to-b from-gray-900 via-[#151922] to-gray-900 text-white rounded-3xl p-6 shadow-2xl border border-gray-800 relative overflow-hidden">
                {/* Gold Glow & Background Mesh Accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                {/* Card Top Branding */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-black text-xs shadow-xs">
                      CS
                    </div>
                    <div>
                      <div className="text-[11px] font-black tracking-wider uppercase text-amber-300">
                        CLUBSPHERE PRIVILEGE
                      </div>
                      <div className="text-[9px] text-gray-400 tracking-widest uppercase">
                        Official Membership Card
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    VERIFIED
                  </span>
                </div>

                {/* Member Avatar & Identity Info */}
                <div className="pt-5 flex items-start gap-4 relative z-10">
                  <div className="relative shrink-0">
                    <img
                      src={regPhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'}
                      alt="Avatar Preview"
                      className="w-18 h-18 rounded-2xl object-cover ring-2 ring-amber-400/40 shadow-lg"
                    />
                    <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 text-white ring-2 ring-gray-900">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-black text-white tracking-tight truncate">
                      {regName || 'New Member Name'}
                    </h4>
                    <p className="text-[11px] text-amber-200/90 font-semibold truncate mt-0.5">
                      {regRole.replace('_', ' ')}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-1">
                      {regPhone || '+91 ••••• •••••'}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {regCity || 'City'}, India
                    </p>
                  </div>
                </div>

                {/* Badges Preview */}
                {regBadges.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10 relative z-10">
                    <div className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                      Recognition Badges:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {regBadges.map((badge) => (
                        <span
                          key={badge}
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-amber-200 border border-white/20"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* LIVE DYNAMIC CUSTOM FIELDS PREVIEW */}
                <div className="mt-4 pt-3 border-t border-white/10 relative z-10">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-indigo-300 mb-2">
                    <span>Custom Attributes ({dynamicFields.filter(f => f.label && f.value).length})</span>
                    <span className="text-[8px] text-gray-400 font-medium">Live sync</span>
                  </div>

                  {dynamicFields.filter(f => f.label.trim() && f.value.trim()).length > 0 ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      {dynamicFields
                        .filter((f) => f.label.trim() && f.value.trim())
                        .map((f) => (
                          <div
                            key={f.id}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[10px]"
                          >
                            <div className="text-gray-400 text-[9px] truncate font-semibold">{f.label}</div>
                            <div className="text-amber-100 font-bold truncate">{f.value}</div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-white/5 border border-dashed border-white/10 text-[10px] text-gray-400 text-center">
                      No custom fields filled yet.
                    </div>
                  )}
                </div>

                {/* Card Footer with Simulated QR & ID */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between relative z-10 text-[10px] text-gray-400">
                  <div>
                    <div className="font-mono text-gray-300 font-bold">#CS-2026-{regPhone ? regPhone.slice(-4) : '8899'}</div>
                    <div className="text-[8px] text-gray-500">MEMBER ID</div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 text-white text-[10px]">
                    <QrCode className="w-3.5 h-3.5 text-amber-300" />
                    <span className="font-mono text-[9px]">DIGITAL PASS</span>
                  </div>
                </div>
              </div>

              {/* Instant Preview Helper Callout */}
              <div className="p-4 rounded-2xl bg-white border border-gray-200 text-xs text-gray-500 space-y-1.5 shadow-xs">
                <div className="font-extrabold text-gray-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Real-Time ID Card Preview</span>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-500">
                  Every change to name, role, photo avatar, badges, and custom dynamic attributes reflects in the preview card above in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: DUES & INVOICING */}
      {activeSection === 'dues' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Dues Invoicing & Billing ({dues.length})
              </h3>
              <p className="text-xs text-gray-500">Collected: ₹{totalDuesCollected.toLocaleString()} • Outstanding: ₹{totalDuesOutstanding.toLocaleString()}</p>
            </div>

            <button
              onClick={() => setIsIssueDuesOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Due Invoice</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Period</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dues.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 font-extrabold text-gray-900">{d.memberName}</td>
                    <td className="p-3 font-extrabold text-gray-900">₹{d.amount.toLocaleString()}</td>
                    <td className="p-3 text-gray-600">{d.period}</td>
                    <td className="p-3 text-gray-500">{d.dueDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {d.status !== 'PAID' ? (
                        <button
                          onClick={() => dispatch(markDueAsPaid({ dueId: d.id }))}
                          className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition cursor-pointer"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">{d.receiptNo}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 6: EXPENSE CLAIMS & APPROVALS */}
      {activeSection === 'expenses' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                Expense Reimbursements & Claims ({expenses.length})
              </h3>
              <p className="text-xs text-gray-500">Core Member claims with attached invoice receipts awaiting Super Admin review</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {expenses.map((e) => (
              <div key={e.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-gray-900">{e.title}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      {e.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      e.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      e.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {e.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{e.description}</p>
                  <div className="text-[11px] text-gray-400">
                    Spent by <span className="font-bold text-gray-700">{e.spentBy}</span> on {e.date}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-base font-black text-gray-900">₹{e.amount.toLocaleString()}</div>
                    {e.receiptName && <div className="text-[10px] text-indigo-600 font-semibold">{e.receiptName}</div>}
                  </div>

                  {e.status === 'PENDING_APPROVAL' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(approveExpenseRequest({ expenseId: e.id, approvedBy: currentUser?.name || 'Super Admin' }))}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => dispatch(rejectExpenseRequest({ expenseId: e.id }))}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 7: EVENTS & BUDGETS */}
      {activeSection === 'events' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                Events & Transparency Budgets ({events.length})
              </h3>
              <p className="text-xs text-gray-500">Publish events with itemized budget breakdowns and media highlights</p>
            </div>

            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 rounded-2xl border border-gray-200 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    className="w-16 h-16 rounded-2xl object-cover ring-1 ring-gray-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-gray-900">{evt.title}</h4>
                    <div className="text-xs text-gray-500">{evt.date} • {evt.venue}</div>
                    <div className="text-xs font-bold text-indigo-700">
                      Budget: ₹{evt.budgetSpent.toLocaleString()} / ₹{evt.totalBudget.toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete event ${evt.title}?`)) {
                      dispatch(deleteEvent(evt.id));
                    }
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 8: CELEBRATIONS ENGINE */}
      {activeSection === 'celebrations' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <Cake className="w-5 h-5 text-rose-500" />
                Celebration Feed & Confetti Engine ({wishes.length})
              </h3>
              <p className="text-xs text-gray-500">Automated birthday and wedding anniversary recognition wall</p>
            </div>

            <button
              onClick={triggerConfetti}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Confetti</span>
            </button>
          </div>

          <div className="space-y-3">
            {wishes.map((w) => (
              <div key={w.id} className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                  <Cake className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-900">{w.wishedBy}</span>
                    <span className="text-[10px] text-gray-400">{w.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1">{w.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 9: GOVERNANCE & AUDIT LOGS */}
      {activeSection === 'logs' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Real-Time Governance & Audit Logs ({auditLogs.length})
            </h3>
            <p className="text-xs text-gray-500">Immutable ledger tracking every administrator approval, rejection, and payment entry</p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-900">{log.action}</div>
                    <div className="text-gray-500 text-[11px]">{log.target} • by {log.performedBy}</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-400">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <IssueDuesModal isOpen={isIssueDuesOpen} onClose={() => setIsIssueDuesOpen(false)} />
      <CreateEventModal isOpen={isCreateEventOpen} onClose={() => setIsCreateEventOpen(false)} />
    </div>
  );
};
