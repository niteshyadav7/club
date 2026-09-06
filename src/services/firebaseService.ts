import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Member, DueRecord, ExpenseEntry, ClubEvent, CelebrationWish, AuditLog } from '../types';

// Collection References
export const MEMBERS_COLLECTION = 'members';
export const DUES_COLLECTION = 'dues';
export const EXPENSES_COLLECTION = 'expenses';
export const EVENTS_COLLECTION = 'events';
export const CELEBRATIONS_COLLECTION = 'celebrations';
export const AUDIT_COLLECTION = 'audit_logs';

// Real-time Subscriptions
export const subscribeToMembers = (onUpdate: (members: Member[]) => void, onError?: (err: any) => void): Unsubscribe => {
  try {
    const colRef = collection(db, MEMBERS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const items: Member[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Member, 'id'>) });
      });
      onUpdate(items);
    }, (err) => {
      console.warn('Firestore members subscription notice:', err.message);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn('Could not subscribe to members:', err);
    return () => {};
  }
};

export const subscribeToDues = (onUpdate: (dues: DueRecord[]) => void, onError?: (err: any) => void): Unsubscribe => {
  try {
    const colRef = collection(db, DUES_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const items: DueRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<DueRecord, 'id'>) });
      });
      onUpdate(items);
    }, (err) => {
      console.warn('Firestore dues subscription notice:', err.message);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn('Could not subscribe to dues:', err);
    return () => {};
  }
};

export const subscribeToExpenses = (onUpdate: (expenses: ExpenseEntry[]) => void, onError?: (err: any) => void): Unsubscribe => {
  try {
    const colRef = collection(db, EXPENSES_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const items: ExpenseEntry[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ExpenseEntry, 'id'>) });
      });
      onUpdate(items);
    }, (err) => {
      console.warn('Firestore expenses subscription notice:', err.message);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn('Could not subscribe to expenses:', err);
    return () => {};
  }
};

export const subscribeToEvents = (onUpdate: (events: ClubEvent[]) => void, onError?: (err: any) => void): Unsubscribe => {
  try {
    const colRef = collection(db, EVENTS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const items: ClubEvent[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ClubEvent, 'id'>) });
      });
      onUpdate(items);
    }, (err) => {
      console.warn('Firestore events subscription notice:', err.message);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn('Could not subscribe to events:', err);
    return () => {};
  }
};

export const subscribeToCelebrations = (onUpdate: (wishes: CelebrationWish[]) => void, onError?: (err: any) => void): Unsubscribe => {
  try {
    const colRef = collection(db, CELEBRATIONS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const items: CelebrationWish[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<CelebrationWish, 'id'>) });
      });
      onUpdate(items);
    }, (err) => {
      console.warn('Firestore celebrations subscription notice:', err.message);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn('Could not subscribe to celebrations:', err);
    return () => {};
  }
};

export const subscribeToAuditLogs = (onUpdate: (logs: AuditLog[]) => void, onError?: (err: any) => void): Unsubscribe => {
  try {
    const colRef = collection(db, AUDIT_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const items: AuditLog[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<AuditLog, 'id'>) });
      });
      onUpdate(items);
    }, (err) => {
      console.warn('Firestore audit logs subscription notice:', err.message);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn('Could not subscribe to audit logs:', err);
    return () => {};
  }
};

// CRUD Operations for Members
export const saveMemberToFirestore = async (member: Member): Promise<void> => {
  try {
    const docRef = doc(db, MEMBERS_COLLECTION, member.id);
    await setDoc(docRef, member, { merge: true });
  } catch (err) {
    console.error('Error saving member to Firestore:', err);
    throw err;
  }
};

export const deleteMemberFromFirestore = async (memberId: string): Promise<void> => {
  try {
    const docRef = doc(db, MEMBERS_COLLECTION, memberId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting member from Firestore:', err);
    throw err;
  }
};

// CRUD Operations for Dues
export const saveDueToFirestore = async (due: DueRecord): Promise<void> => {
  try {
    const docRef = doc(db, DUES_COLLECTION, due.id);
    await setDoc(docRef, due, { merge: true });
  } catch (err) {
    console.error('Error saving due to Firestore:', err);
    throw err;
  }
};

export const deleteDueFromFirestore = async (dueId: string): Promise<void> => {
  try {
    const docRef = doc(db, DUES_COLLECTION, dueId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting due from Firestore:', err);
    throw err;
  }
};

// CRUD Operations for Expenses
export const saveExpenseToFirestore = async (expense: ExpenseEntry): Promise<void> => {
  try {
    const docRef = doc(db, EXPENSES_COLLECTION, expense.id);
    await setDoc(docRef, expense, { merge: true });
  } catch (err) {
    console.error('Error saving expense to Firestore:', err);
    throw err;
  }
};

export const deleteExpenseFromFirestore = async (expenseId: string): Promise<void> => {
  try {
    const docRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting expense from Firestore:', err);
    throw err;
  }
};

// CRUD Operations for Events
export const saveEventToFirestore = async (event: ClubEvent): Promise<void> => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, event.id);
    await setDoc(docRef, event, { merge: true });
  } catch (err) {
    console.error('Error saving event to Firestore:', err);
    throw err;
  }
};

export const deleteEventFromFirestore = async (eventId: string): Promise<void> => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting event from Firestore:', err);
    throw err;
  }
};

// CRUD Operations for Celebration Wishes
export const saveWishToFirestore = async (wish: CelebrationWish): Promise<void> => {
  try {
    const docRef = doc(db, CELEBRATIONS_COLLECTION, wish.id);
    await setDoc(docRef, wish, { merge: true });
  } catch (err) {
    console.error('Error saving wish to Firestore:', err);
    throw err;
  }
};

// CRUD Operations for Audit Logs
export const saveAuditLogToFirestore = async (log: AuditLog): Promise<void> => {
  try {
    const docRef = doc(db, AUDIT_COLLECTION, log.id);
    await setDoc(docRef, log, { merge: true });
  } catch (err) {
    console.error('Error saving audit log to Firestore:', err);
  }
};

// Super Admin Credentials and Firestore Seeding
export const SUPER_ADMIN_CREDENTIALS = {
  email: 'superadmin@gmail.com',
  password: 'Nitesh@123',
  name: 'Super Admin',
};

export const seedSuperAdminAccount = async (): Promise<Member> => {
  const superAdminDoc: Member = {
    id: 'admin-superadmin',
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    phone: '+91 98000 12345',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    address: 'Executive Suite 1, ClubSphere Governance Headquarters',
    city: 'Mumbai',
    bio: 'Super Administrator with complete governance and approval authority.',
    role: 'ADMIN',
    verificationStatus: 'VERIFIED',
    badges: ['Super Admin', 'Founding Member', 'Core Member', 'VIP Member'],
    birthday: '1990-01-01',
    joinedDate: new Date().toISOString().split('T')[0],
    duesStatus: 'PAID',
  };
  await saveMemberToFirestore(superAdminDoc);
  return superAdminDoc;
};

