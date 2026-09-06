import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member, UserRole } from '../../types';

interface AuthState {
  currentUser: Member | null;
  role: UserRole;
  isVerified: boolean;
  loading: boolean;
  isGoogleModalOpen: boolean;
  authError: string | null;
  isLiveFirebase: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  role: 'PENDING',
  isVerified: false,
  loading: false,
  isGoogleModalOpen: false,
  authError: null,
  isLiveFirebase: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<Member | null>) => {
      state.currentUser = action.payload;
      if (action.payload) {
        state.role = action.payload.role;
        state.isVerified = action.payload.verificationStatus === 'VERIFIED';
      } else {
        state.role = 'PENDING';
        state.isVerified = false;
      }
    },
    switchDemoRole: (state, action: PayloadAction<{ role: UserRole; members?: Member[] }>) => {
      state.role = action.payload.role;
      const targetRole = action.payload.role;
      const membersList = action.payload.members || [];
      const matched = membersList.find(m => m.role === targetRole);
      if (matched) {
        state.currentUser = matched;
        state.isVerified = matched.verificationStatus === 'VERIFIED';
      } else if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          role: targetRole,
          verificationStatus: targetRole === 'PENDING' ? 'PENDING_APPROVAL' : 'VERIFIED'
        };
        state.isVerified = targetRole !== 'PENDING';
      }
    },
    updateCurrentProfile: (state, action: PayloadAction<Partial<Member>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    setGoogleModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isGoogleModalOpen = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.authError = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.role = 'PENDING';
      state.isVerified = false;
    }
  },
});

export const {
  setCurrentUser,
  switchDemoRole,
  updateCurrentProfile,
  setGoogleModalOpen,
  setAuthLoading,
  setAuthError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
