import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import membersReducer from './slices/membersSlice';
import duesReducer from './slices/duesSlice';
import expensesReducer from './slices/expensesSlice';
import eventsReducer from './slices/eventsSlice';
import celebrationsReducer from './slices/celebrationsSlice';
import uiReducer from './slices/uiSlice';
import auditReducer from './slices/auditSlice';
import { loadStoredState, saveStateToStorage } from './localStorageSync';

const rootReducer = combineReducers({
  auth: authReducer,
  members: membersReducer,
  dues: duesReducer,
  expenses: expensesReducer,
  events: eventsReducer,
  celebrations: celebrationsReducer,
  ui: uiReducer,
  audit: auditReducer,
});

const preloadedState = loadStoredState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Subscribe to store changes to save dynamically to localStorage
store.subscribe(() => {
  saveStateToStorage(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
