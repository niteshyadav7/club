import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClubEvent, BudgetItem } from '../../types';
import { saveEventToFirestore, deleteEventFromFirestore } from '../../services/firebaseService';

interface EventsState {
  events: ClubEvent[];
  selectedEvent: ClubEvent | null;
  filterType: 'ALL' | 'UPCOMING' | 'PAST';
}

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  filterType: 'ALL',
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<ClubEvent[]>) => {
      state.events = action.payload;
    },

    addEvent: (state, action: PayloadAction<ClubEvent>) => {
      state.events.unshift(action.payload);
      saveEventToFirestore(action.payload).catch(err => console.warn('Firestore event sync notice:', err));
    },

    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(e => e.id !== action.payload);
      if (state.selectedEvent?.id === action.payload) {
        state.selectedEvent = null;
      }
      deleteEventFromFirestore(action.payload).catch(err => console.warn('Firestore event delete notice:', err));
    },

    updateEventBudget: (state, action: PayloadAction<{ eventId: string; breakdown: BudgetItem[]; totalSpent: number }>) => {
      const event = state.events.find(e => e.id === action.payload.eventId);
      if (event) {
        event.budgetBreakdown = action.payload.breakdown;
        event.budgetSpent = action.payload.totalSpent;
        saveEventToFirestore(event).catch(err => console.warn('Firestore event sync notice:', err));
      }
    },

    setSelectedEvent: (state, action: PayloadAction<ClubEvent | null>) => {
      state.selectedEvent = action.payload;
    },

    setFilterType: (state, action: PayloadAction<'ALL' | 'UPCOMING' | 'PAST'>) => {
      state.filterType = action.payload;
    },
  },
});

export const {
  setEvents,
  addEvent,
  deleteEvent,
  updateEventBudget,
  setSelectedEvent,
  setFilterType,
} = eventsSlice.actions;

export default eventsSlice.reducer;
