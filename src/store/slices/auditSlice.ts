import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuditLog } from '../../types';
import { saveAuditLogToFirestore } from '../../services/firebaseService';

interface AuditState {
  logs: AuditLog[];
}

const initialState: AuditState = {
  logs: [],
};

export const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setAuditLogs: (state, action: PayloadAction<AuditLog[]>) => {
      state.logs = action.payload;
    },
    addAuditLog: (state, action: PayloadAction<Omit<AuditLog, 'id' | 'timestamp'>>) => {
      const now = new Date();
      const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp,
        ...action.payload,
      };
      state.logs.unshift(newLog);
      saveAuditLogToFirestore(newLog).catch(err => console.warn('Firestore audit log notice:', err));
    },
    clearLogs: (state) => {
      state.logs = [];
    }
  },
});

export const { setAuditLogs, addAuditLog, clearLogs } = auditSlice.actions;
export default auditSlice.reducer;
