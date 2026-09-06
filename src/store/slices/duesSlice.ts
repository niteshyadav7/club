import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DueRecord } from '../../types';
import { saveDueToFirestore, deleteDueFromFirestore } from '../../services/firebaseService';

interface DuesState {
  dues: DueRecord[];
  statusFilter: 'ALL' | 'PAID' | 'PENDING' | 'OVERDUE';
  searchQuery: string;
}

const initialState: DuesState = {
  dues: [],
  statusFilter: 'ALL',
  searchQuery: '',
};

export const duesSlice = createSlice({
  name: 'dues',
  initialState,
  reducers: {
    setDues: (state, action: PayloadAction<DueRecord[]>) => {
      state.dues = action.payload;
    },

    markDueAsPaid: (state, action: PayloadAction<{
      dueId: string;
      receiptNo?: string;
      paymentMethod?: 'UPI' | 'Bank Transfer' | 'Cash' | 'Card';
      paidDate?: string;
    }>) => {
      const record = state.dues.find(d => d.id === action.payload.dueId);
      if (record) {
        record.status = 'PAID';
        record.paidDate = action.payload.paidDate || new Date().toISOString().split('T')[0];
        record.receiptNo = action.payload.receiptNo || `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
        record.paymentMethod = action.payload.paymentMethod || 'UPI';
        saveDueToFirestore(record).catch(err => console.warn('Firestore due sync notice:', err));
      }
    },

    issueNewDueInvoice: (state, action: PayloadAction<{
      memberId: string;
      memberName: string;
      memberEmail: string;
      memberPhone: string;
      memberPhoto: string;
      amount: number;
      period: string;
      dueDate: string;
    }>) => {
      const newDue: DueRecord = {
        id: `due-${Date.now()}`,
        memberId: action.payload.memberId,
        memberName: action.payload.memberName,
        memberEmail: action.payload.memberEmail,
        memberPhone: action.payload.memberPhone,
        memberPhoto: action.payload.memberPhoto,
        amount: action.payload.amount,
        period: action.payload.period,
        dueDate: action.payload.dueDate,
        status: 'PENDING',
      };
      state.dues.unshift(newDue);
      saveDueToFirestore(newDue).catch(err => console.warn('Firestore due sync notice:', err));
    },

    deleteDueRecord: (state, action: PayloadAction<string>) => {
      state.dues = state.dues.filter(d => d.id !== action.payload);
      deleteDueFromFirestore(action.payload).catch(err => console.warn('Firestore due delete notice:', err));
    },

    addDueRecord: (state, action: PayloadAction<DueRecord>) => {
      state.dues.unshift(action.payload);
      saveDueToFirestore(action.payload).catch(err => console.warn('Firestore due sync notice:', err));
    },

    setStatusFilter: (state, action: PayloadAction<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>) => {
      state.statusFilter = action.payload;
    },

    setDuesSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setDues,
  markDueAsPaid,
  issueNewDueInvoice,
  deleteDueRecord,
  addDueRecord,
  setStatusFilter,
  setDuesSearchQuery,
} = duesSlice.actions;

export default duesSlice.reducer;
