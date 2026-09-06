import { useEffect } from 'react';
import { useAppDispatch, store } from '../store';
import { setCurrentUser } from '../store/slices/authSlice';
import { setMembers } from '../store/slices/membersSlice';
import { setDues } from '../store/slices/duesSlice';
import { setExpenses } from '../store/slices/expensesSlice';
import { setEvents } from '../store/slices/eventsSlice';
import { setWishes } from '../store/slices/celebrationsSlice';
import { setAuditLogs } from '../store/slices/auditSlice';
import { setupCrossTabSync, getStoredMembers } from '../store/localStorageSync';
import {
  subscribeToMembers,
  subscribeToDues,
  subscribeToExpenses,
  subscribeToEvents,
  subscribeToCelebrations,
  subscribeToAuditLogs,
} from '../services/firebaseService';

export function useFirebaseSync() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Preload any stored applicants or members immediately
    const storedMembers = getStoredMembers();
    if (storedMembers.length > 0) {
      dispatch(setMembers(storedMembers));
    }

    // 2. Cross-tab real-time sync (between member window and admin window)
    const cleanupCrossTab = setupCrossTabSync(dispatch, store.getState);

    // 3. Subscribe to all Firestore collections in real time
    const unsubMembers = subscribeToMembers((members) => {
      dispatch(setMembers(members));

      // Auto-sync current logged-in user profile, avatar photoUrl, and verification status from Firestore
      const currentAuthUser = store.getState().auth.currentUser;
      if (currentAuthUser) {
        const matched = members.find(
          (m) =>
            m.id === currentAuthUser.id ||
            (currentAuthUser.email && m.email?.toLowerCase().trim() === currentAuthUser.email.toLowerCase().trim())
        );
        if (matched) {
          const isPhotoChanged = matched.photoUrl && matched.photoUrl !== currentAuthUser.photoUrl;
          const isStatusChanged = matched.verificationStatus !== currentAuthUser.verificationStatus;
          const isRoleChanged = matched.role !== currentAuthUser.role;
          if (isPhotoChanged || isStatusChanged || isRoleChanged) {
            dispatch(setCurrentUser({ ...currentAuthUser, ...matched }));
          }
        }
      }
    });

    const unsubDues = subscribeToDues((dues) => {
      dispatch(setDues(dues));
    });

    const unsubExpenses = subscribeToExpenses((expenses) => {
      dispatch(setExpenses(expenses));
    });

    const unsubEvents = subscribeToEvents((events) => {
      dispatch(setEvents(events));
    });

    const unsubCelebrations = subscribeToCelebrations((wishes) => {
      dispatch(setWishes(wishes));
    });

    const unsubAudit = subscribeToAuditLogs((logs) => {
      dispatch(setAuditLogs(logs));
    });

    return () => {
      cleanupCrossTab();
      unsubMembers();
      unsubDues();
      unsubExpenses();
      unsubEvents();
      unsubCelebrations();
      unsubAudit();
    };
  }, [dispatch]);
}
