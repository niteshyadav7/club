import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExpenseEntry, ExpenseCategory, ExpenseStatus } from '../../types';
import { saveExpenseToFirestore, deleteExpenseFromFirestore } from '../../services/firebaseService';

interface ExpensesState {
  expenses: ExpenseEntry[];
  totalBudgetLimit: number;
  availableCategories: string[];
  categoryFilter: string | null;
  statusFilter: 'ALL' | 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';
}

const DEFAULT_CATEGORIES = [
  'Venue & Facility',
  'Catering & Dining',
  'Logistics & Travel',
  'Marketing & Media',
  'Sound & Production',
  'Equipment & Sports',
  'Miscellaneous',
];

const initialState: ExpensesState = {
  expenses: [],
  totalBudgetLimit: 1500000, // Annual Club Budget ₹15 Lakhs
  availableCategories: DEFAULT_CATEGORIES,
  categoryFilter: null,
  statusFilter: 'ALL',
};

export const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<ExpenseEntry[]>) => {
      state.expenses = action.payload;
    },

    submitExpenseRequest: (state, action: PayloadAction<{
      title: string;
      amount: number;
      category: string;
      spentBy: string;
      spentByMemberId: string;
      spentByRole: 'ADMIN' | 'CORE_MEMBER';
      description: string;
      receiptUrl?: string;
      receiptName?: string;
      eventId?: string;
      eventTitle?: string;
    }>) => {
      const newExpense: ExpenseEntry = {
        id: `exp-${Date.now()}`,
        title: action.payload.title,
        amount: action.payload.amount,
        category: action.payload.category,
        date: new Date().toISOString().split('T')[0],
        spentBy: action.payload.spentBy,
        spentByMemberId: action.payload.spentByMemberId,
        spentByRole: action.payload.spentByRole,
        status: 'PENDING_APPROVAL',
        description: action.payload.description,
        receiptUrl: action.payload.receiptUrl || 'https://images.unsplash.com/photo-1554415707-9e4c29753a81?w=600&auto=format&fit=crop&q=80',
        receiptName: action.payload.receiptName || 'Attached_Invoice_Receipt.pdf',
        eventId: action.payload.eventId,
        eventTitle: action.payload.eventTitle,
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.expenses.unshift(newExpense);
      saveExpenseToFirestore(newExpense).catch(err => console.warn('Firestore expense sync notice:', err));
    },

    approveExpenseRequest: (state, action: PayloadAction<{ expenseId: string; approvedBy: string; adminNotes?: string }>) => {
      const item = state.expenses.find(e => e.id === action.payload.expenseId);
      if (item) {
        item.status = 'APPROVED';
        item.approvedBy = action.payload.approvedBy;
        item.adminNotes = action.payload.adminNotes;
        saveExpenseToFirestore(item).catch(err => console.warn('Firestore expense sync notice:', err));
      }
    },

    rejectExpenseRequest: (state, action: PayloadAction<{ expenseId: string; adminNotes?: string }>) => {
      const item = state.expenses.find(e => e.id === action.payload.expenseId);
      if (item) {
        item.status = 'REJECTED';
        item.adminNotes = action.payload.adminNotes || 'Declined by Admin Board';
        saveExpenseToFirestore(item).catch(err => console.warn('Firestore expense sync notice:', err));
      }
    },

    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
      deleteExpenseFromFirestore(action.payload).catch(err => console.warn('Firestore expense delete notice:', err));
    },

    setBudgetLimit: (state, action: PayloadAction<number>) => {
      state.totalBudgetLimit = action.payload;
    },

    addNewCategory: (state, action: PayloadAction<string>) => {
      const trimmed = action.payload.trim();
      if (trimmed && !state.availableCategories.includes(trimmed)) {
        state.availableCategories.push(trimmed);
      }
    },

    addDirectLedgerEntry: (state, action: PayloadAction<ExpenseEntry>) => {
      state.expenses.unshift(action.payload);
      saveExpenseToFirestore(action.payload).catch(err => console.warn('Firestore expense sync notice:', err));
    },

    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.categoryFilter = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<'ALL' | 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED'>) => {
      state.statusFilter = action.payload;
    },
  },
});

export const {
  setExpenses,
  submitExpenseRequest,
  approveExpenseRequest,
  rejectExpenseRequest,
  deleteExpense,
  setBudgetLimit,
  addNewCategory,
  addDirectLedgerEntry,
  setCategoryFilter,
  setStatusFilter,
} = expensesSlice.actions;

export default expensesSlice.reducer;
