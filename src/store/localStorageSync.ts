import { RootState, AppDispatch } from './index';
import { setMembers } from './slices/membersSlice';
import { setDues } from './slices/duesSlice';
import { setExpenses } from './slices/expensesSlice';
import { setEvents } from './slices/eventsSlice';
import { setWishes } from './slices/celebrationsSlice';
import { setCurrentUser } from './slices/authSlice';
import { Member } from '../types';

const STORAGE_DATA_KEY = 'clubsphere_shared_data_v3';
const SESSION_AUTH_KEY = 'clubsphere_auth_session_v3';
const CHANNEL_NAME = 'clubsphere_cross_tab_bus_v3';

let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  // Fallback to storage events
}

export const loadStoredState = () => {
  try {
    // 1. Load per-tab / local auth session
    let authState: any = undefined;
    const sessionAuth = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(SESSION_AUTH_KEY) : null;
    const localAuth = typeof localStorage !== 'undefined' ? localStorage.getItem(SESSION_AUTH_KEY) : null;
    if (sessionAuth) {
      authState = JSON.parse(sessionAuth);
    } else if (localAuth) {
      authState = JSON.parse(localAuth);
    }

    // 2. Load shared club data
    const serializedData = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_DATA_KEY) : null;
    const sharedData = serializedData ? JSON.parse(serializedData) : {};

    return {
      ...(authState ? { auth: authState } : {}),
      ...(sharedData.members ? { members: sharedData.members } : {}),
      ...(sharedData.dues ? { dues: sharedData.dues } : {}),
      ...(sharedData.expenses ? { expenses: sharedData.expenses } : {}),
      ...(sharedData.events ? { events: sharedData.events } : {}),
      ...(sharedData.celebrations ? { celebrations: sharedData.celebrations } : {}),
      ...(sharedData.audit ? { audit: sharedData.audit } : {}),
    };
  } catch (err) {
    console.warn('Failed to load state from storage:', err);
    return undefined;
  }
};

export const saveStateToStorage = (state: RootState) => {
  try {
    // 1. Save Auth to SessionStorage (per tab) & LocalStorage (recovery)
    if (state.auth) {
      const authSerialized = JSON.stringify(state.auth);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(SESSION_AUTH_KEY, authSerialized);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(SESSION_AUTH_KEY, authSerialized);
      }
    }

    // 2. Merge and save shared data in LocalStorage
    const existingRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_DATA_KEY) : null;
    const existingData = existingRaw ? JSON.parse(existingRaw) : {};
    
    // Merge members list so no registered applicant is ever overwritten
    const existingMembers: Member[] = existingData.members?.members || [];
    const currentMembers: Member[] = state.members?.members || [];
    
    const memberMap = new Map<string, Member>();
    // First insert existing
    existingMembers.forEach(m => {
      const key = m.email ? m.email.toLowerCase().trim() : m.id;
      memberMap.set(key, m);
    });
    // Overlay current (authoritative)
    currentMembers.forEach(m => {
      const key = m.email ? m.email.toLowerCase().trim() : m.id;
      const existing = memberMap.get(key);
      if (existing && existing.verificationStatus === 'VERIFIED' && m.verificationStatus !== 'VERIFIED') {
        memberMap.set(key, { ...m, verificationStatus: 'VERIFIED' });
      } else {
        memberMap.set(key, m);
      }
    });
    
    const mergedMembers = Array.from(memberMap.values());

    const payload = {
      members: { ...state.members, members: mergedMembers },
      dues: state.dues,
      expenses: state.expenses,
      events: state.events,
      celebrations: state.celebrations,
      audit: state.audit,
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(payload));
    }

    // 3. Broadcast update across open browser tabs
    if (syncChannel) {
      syncChannel.postMessage({ type: 'DATA_SYNC', payload });
    }
  } catch (err) {
    console.warn('Failed to save state to storage:', err);
  }
};

export const getStoredMembers = (): Member[] => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_DATA_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const list: Member[] = parsed.members?.members || [];
    const map = new Map<string, Member>();
    for (const m of list) {
      const key = m.email ? m.email.toLowerCase().trim() : m.id;
      map.set(key, m);
    }
    return Array.from(map.values());
  } catch (e) {
    return [];
  }
};

export const broadcastMemberVerification = (memberId: string, verifiedMember: Member) => {
  try {
    if (syncChannel) {
      syncChannel.postMessage({
        type: 'MEMBER_VERIFIED',
        memberId,
        member: verifiedMember
      });
    }
  } catch (e) {
    // ignore
  }
};

export const setupCrossTabSync = (dispatch: AppDispatch, getState: () => RootState) => {
  const handleIncomingData = (incoming: any) => {
    if (!incoming) return;
    const currentState = getState();

    // Sync members
    if (incoming.members?.members) {
      dispatch(setMembers(incoming.members.members));

      // If currently logged-in user in this tab got verified or updated, sync immediately
      if (currentState.auth.currentUser) {
        const matchingUpdated = incoming.members.members.find(
          (m: Member) =>
            m.id === currentState.auth.currentUser?.id ||
            (currentState.auth.currentUser?.email && m.email?.toLowerCase() === currentState.auth.currentUser.email.toLowerCase())
        );
        if (matchingUpdated && matchingUpdated.verificationStatus !== currentState.auth.currentUser.verificationStatus) {
          dispatch(setCurrentUser(matchingUpdated));
        }
      }
    }

    if (incoming.dues?.dues) dispatch(setDues(incoming.dues.dues));
    if (incoming.expenses?.expenses) dispatch(setExpenses(incoming.expenses.expenses));
    if (incoming.events?.events) dispatch(setEvents(incoming.events.events));
    if (incoming.celebrations?.wishes) dispatch(setWishes(incoming.celebrations.wishes));
  };

  // 1. BroadcastChannel Listener
  if (syncChannel) {
    syncChannel.onmessage = (event) => {
      if (event.data?.type === 'DATA_SYNC' && event.data.payload) {
        handleIncomingData(event.data.payload);
      } else if (event.data?.type === 'MEMBER_VERIFIED' && event.data.member) {
        const verified = event.data.member;
        const currentState = getState();
        if (
          currentState.auth.currentUser &&
          (currentState.auth.currentUser.id === verified.id ||
           (currentState.auth.currentUser.email && verified.email && currentState.auth.currentUser.email.toLowerCase() === verified.email.toLowerCase()))
        ) {
          dispatch(setCurrentUser(verified));
        }
      }
    };
  }

  // 2. Storage event listener (fallback)
  const onStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_DATA_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        handleIncomingData(parsed);
      } catch (err) {
        console.warn('Error syncing storage event:', err);
      }
    }
  };

  window.addEventListener('storage', onStorageChange);

  return () => {
    window.removeEventListener('storage', onStorageChange);
  };
};
