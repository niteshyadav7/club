import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CelebrationWish } from '../../types';
import { saveWishToFirestore } from '../../services/firebaseService';

interface CelebrationsState {
  wishes: CelebrationWish[];
  isBannerDismissed: boolean;
}

const initialState: CelebrationsState = {
  wishes: [],
  isBannerDismissed: false,
};

export const celebrationsSlice = createSlice({
  name: 'celebrations',
  initialState,
  reducers: {
    setWishes: (state, action: PayloadAction<CelebrationWish[]>) => {
      state.wishes = action.payload;
    },

    sendWish: (state, action: PayloadAction<{
      memberId: string;
      memberName: string;
      type: 'BIRTHDAY' | 'ANNIVERSARY';
      wishedBy: string;
      wishedByPhoto?: string;
      message: string;
    }>) => {
      const newWish: CelebrationWish = {
        id: `wish-${Date.now()}`,
        memberId: action.payload.memberId,
        memberName: action.payload.memberName,
        type: action.payload.type,
        wishedBy: action.payload.wishedBy,
        wishedByPhoto: action.payload.wishedByPhoto,
        message: action.payload.message,
        timestamp: 'Just now',
      };
      state.wishes.unshift(newWish);
      saveWishToFirestore(newWish).catch(err => console.warn('Firestore wish sync notice:', err));
    },

    dismissBanner: (state) => {
      state.isBannerDismissed = true;
    },

    resetBanner: (state) => {
      state.isBannerDismissed = false;
    }
  },
});

export const {
  setWishes,
  sendWish,
  dismissBanner,
  resetBanner,
} = celebrationsSlice.actions;

export default celebrationsSlice.reducer;
