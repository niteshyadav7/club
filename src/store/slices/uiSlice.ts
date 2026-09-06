import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface UiState {
  activeTab: 'directory' | 'dues' | 'expenses' | 'events' | 'admin';
  isPreAddModalOpen: boolean;
  isExpenseModalOpen: boolean;
  isMemberDetailModalOpen: boolean;
  isProfileEditModalOpen: boolean;
  isEventDetailModalOpen: boolean;
  isMarkPaidModalOpen: boolean;
  selectedDueIdForPayment: string | null;
  toasts: ToastNotification[];
}

const initialState: UiState = {
  activeTab: 'directory',
  isPreAddModalOpen: false,
  isExpenseModalOpen: false,
  isMemberDetailModalOpen: false,
  isProfileEditModalOpen: false,
  isEventDetailModalOpen: false,
  isMarkPaidModalOpen: false,
  selectedDueIdForPayment: null,
  toasts: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'directory' | 'dues' | 'expenses' | 'events' | 'admin'>) => {
      state.activeTab = action.payload;
    },
    setPreAddModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isPreAddModalOpen = action.payload;
    },
    setExpenseModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isExpenseModalOpen = action.payload;
    },
    setMemberDetailModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isMemberDetailModalOpen = action.payload;
    },
    setProfileEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isProfileEditModalOpen = action.payload;
    },
    setEventDetailModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEventDetailModalOpen = action.payload;
    },
    setMarkPaidModalOpen: (state, action: PayloadAction<{ open: boolean; dueId?: string }>) => {
      state.isMarkPaidModalOpen = action.payload.open;
      state.selectedDueIdForPayment = action.payload.dueId || null;
    },
    addToast: (state, action: PayloadAction<Omit<ToastNotification, 'id'>>) => {
      const newToast: ToastNotification = {
        id: `toast-${Date.now()}-${Math.random()}`,
        ...action.payload
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  setActiveTab,
  setPreAddModalOpen,
  setExpenseModalOpen,
  setMemberDetailModalOpen,
  setProfileEditModalOpen,
  setEventDetailModalOpen,
  setMarkPaidModalOpen,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
