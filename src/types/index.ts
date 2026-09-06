export type UserRole = 'ADMIN' | 'CORE_MEMBER' | 'GENERAL_MEMBER' | 'PENDING';

export type VerificationStatus = 'VERIFIED' | 'PENDING_APPROVAL' | 'REJECTED';

export type BadgeType = string;

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  bio: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  badges: string[];
  birthday: string; // YYYY-MM-DD
  anniversary?: string; // YYYY-MM-DD
  joinedDate: string;
  occupation?: string;
  company?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    website?: string;
    twitter?: string;
  };
  duesStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  customFields?: Record<string, string>;
}

export interface DueRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberPhoto: string;
  amount: number;
  period: string; // e.g., "Annual Membership 2026", "Q3 2026", "Tournament Entry Fee"
  dueDate: string;
  paidDate?: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  receiptNo?: string;
  paymentMethod?: 'UPI' | 'Bank Transfer' | 'Cash' | 'Card';
}

export type ExpenseCategory = string;

export type ExpenseStatus = 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';

export interface ExpenseEntry {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  spentBy: string;
  spentByMemberId: string;
  spentByRole: 'ADMIN' | 'CORE_MEMBER';
  status: ExpenseStatus;
  receiptUrl?: string;
  receiptName?: string;
  description: string;
  eventId?: string;
  eventTitle?: string;
  adminNotes?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  amount: number;
  description: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  venue: string;
  locationLink?: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  highlights: string[];
  instagramLinks: string[]; // Instagram post/reel URLs
  totalBudget: number;
  budgetSpent: number;
  budgetBreakdown: BudgetItem[];
  isPast: boolean;
  attendeesCount?: number;
}

export interface CelebrationWish {
  id: string;
  memberId: string;
  memberName: string;
  type: 'BIRTHDAY' | 'ANNIVERSARY';
  wishedBy: string;
  wishedByPhoto?: string;
  message: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  target: string;
  timestamp: string;
  type: 'MEMBER' | 'DUES' | 'EXPENSE' | 'EVENT' | 'BADGE';
}
