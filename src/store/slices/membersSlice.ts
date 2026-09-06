import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member, BadgeType, UserRole } from '../../types';
import { saveMemberToFirestore, deleteMemberFromFirestore } from '../../services/firebaseService';
import { broadcastMemberVerification } from '../localStorageSync';

interface MembersState {
  members: Member[];
  availableBadges: string[];
  selectedMember: Member | null;
  searchQuery: string;
  filterBadge: string | null;
  filterRole: string | null;
  filterCity: string | null;
}

const DEFAULT_BADGES = [
  'Founding Member',
  'Core Member',
  'VIP Member',
  'Treasurer',
  'Event Organizer',
  'Star Contributor',
  'Youth Lead',
  'Honorary Member',
];

const initialState: MembersState = {
  members: [],
  availableBadges: DEFAULT_BADGES,
  selectedMember: null,
  searchQuery: '',
  filterBadge: null,
  filterRole: null,
  filterCity: null,
};

export const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<Member[]>) => {
      if (action.payload.length === 0 && state.members.length > 0) {
        return;
      }
      const map = new Map<string, Member>();

      // Remote / incoming members
      for (const m of action.payload) {
        const key = m.email ? m.email.toLowerCase().trim() : m.id;
        const existing = map.get(key);
        if (existing) {
          if (existing.verificationStatus === 'VERIFIED' && m.verificationStatus !== 'VERIFIED') {
            continue; // Preserve already verified status
          }
          if (m.verificationStatus === 'VERIFIED') {
            map.set(key, { ...existing, ...m, verificationStatus: 'VERIFIED' });
            continue;
          }
        }
        map.set(key, m);
      }

      // Preserve local state if locally verified
      for (const m of state.members) {
        const key = m.email ? m.email.toLowerCase().trim() : m.id;
        const existing = map.get(key);
        if (existing) {
          if (m.verificationStatus === 'VERIFIED' && existing.verificationStatus !== 'VERIFIED') {
            map.set(key, { ...existing, ...m, verificationStatus: 'VERIFIED' });
          }
        } else {
          map.set(key, m);
        }
      }

      state.members = Array.from(map.values());
    },

    addApplicantMember: (state, action: PayloadAction<Member>) => {
      const exists = state.members.find(
        (m) => m.id === action.payload.id || (action.payload.email && m.email?.toLowerCase().trim() === action.payload.email.toLowerCase().trim())
      );
      if (!exists) {
        state.members.unshift(action.payload);
      } else {
        const index = state.members.findIndex((m) => m.id === exists.id);
        state.members[index] = { ...exists, ...action.payload };
      }
      saveMemberToFirestore(action.payload).catch((err) => console.warn('Firestore sync notice:', err));
    },

    addMemberByPhone: (state, action: PayloadAction<{
      name: string;
      phone: string;
      email?: string;
      photoUrl?: string;
      address: string;
      city: string;
      bio: string;
      role: UserRole;
      badges: string[];
      occupation?: string;
      company?: string;
      birthday?: string;
      anniversary?: string;
      customFields?: Record<string, string>;
    }>) => {
      const newMember: Member = {
        id: `mem-${Date.now()}`,
        name: action.payload.name,
        phone: action.payload.phone,
        email: action.payload.email || `${action.payload.name.toLowerCase().replace(/\s+/g, '.')}@club.org`,
        photoUrl: action.payload.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        address: action.payload.address,
        city: action.payload.city,
        bio: action.payload.bio,
        role: action.payload.role,
        verificationStatus: 'VERIFIED',
        badges: action.payload.badges,
        birthday: action.payload.birthday || '1990-01-01',
        anniversary: action.payload.anniversary,
        joinedDate: new Date().toISOString().split('T')[0],
        occupation: action.payload.occupation,
        company: action.payload.company,
        duesStatus: 'PENDING',
        customFields: action.payload.customFields || {}
      };
      state.members.unshift(newMember);
      saveMemberToFirestore(newMember).catch(err => console.warn('Firestore sync notice:', err));
    },

    verifyMember: (state, action: PayloadAction<{ memberId: string; role: UserRole; badges: string[] }>) => {
      const targetId = action.payload.memberId;
      const target = state.members.find(m => m.id === targetId);
      const targetEmail = target?.email?.toLowerCase().trim();

      state.members.forEach((m) => {
        if (
          m.id === targetId ||
          (targetEmail && m.email && m.email.toLowerCase().trim() === targetEmail)
        ) {
          m.verificationStatus = 'VERIFIED';
          m.role = action.payload.role;
          m.badges = action.payload.badges;
          broadcastMemberVerification(m.id, m);
          saveMemberToFirestore(m).catch(err => console.warn('Firestore sync notice:', err));
        }
      });
    },

    rejectMember: (state, action: PayloadAction<{ memberId: string }>) => {
      const targetId = action.payload.memberId;
      const target = state.members.find(m => m.id === targetId);
      const targetEmail = target?.email?.toLowerCase().trim();

      state.members.forEach((m) => {
        if (
          m.id === targetId ||
          (targetEmail && m.email && m.email.toLowerCase().trim() === targetEmail)
        ) {
          m.verificationStatus = 'REJECTED';
          broadcastMemberVerification(m.id, m);
          saveMemberToFirestore(m).catch(err => console.warn('Firestore sync notice:', err));
        }
      });
    },

    deleteMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(m => m.id !== action.payload);
      if (state.selectedMember?.id === action.payload) {
        state.selectedMember = null;
      }
      deleteMemberFromFirestore(action.payload).catch(err => console.warn('Firestore delete notice:', err));
    },

    updateMemberRole: (state, action: PayloadAction<{ memberId: string; role: UserRole }>) => {
      const member = state.members.find(m => m.id === action.payload.memberId);
      if (member) {
        member.role = action.payload.role;
        saveMemberToFirestore(member).catch(err => console.warn('Firestore sync notice:', err));
      }
    },

    updateMemberBadges: (state, action: PayloadAction<{ memberId: string; badges: string[] }>) => {
      const member = state.members.find(m => m.id === action.payload.memberId);
      if (member) {
        member.badges = action.payload.badges;
        saveMemberToFirestore(member).catch(err => console.warn('Firestore sync notice:', err));
      }
    },

    addNewCustomBadge: (state, action: PayloadAction<string>) => {
      const trimmed = action.payload.trim();
      if (trimmed && !state.availableBadges.includes(trimmed)) {
        state.availableBadges.push(trimmed);
      }
    },

    updateMemberProfile: (state, action: PayloadAction<Member>) => {
      const index = state.members.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
      }
      if (state.selectedMember?.id === action.payload.id) {
        state.selectedMember = action.payload;
      }
      saveMemberToFirestore(action.payload).catch(err => console.warn('Firestore sync notice:', err));
    },

    setSelectedMember: (state, action: PayloadAction<Member | null>) => {
      state.selectedMember = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setFilterBadge: (state, action: PayloadAction<string | null>) => {
      state.filterBadge = action.payload;
    },

    setFilterRole: (state, action: PayloadAction<string | null>) => {
      state.filterRole = action.payload;
    },

    setFilterCity: (state, action: PayloadAction<string | null>) => {
      state.filterCity = action.payload;
    },
  },
});

export const {
  setMembers,
  addApplicantMember,
  addMemberByPhone,
  verifyMember,
  rejectMember,
  deleteMember,
  updateMemberRole,
  updateMemberBadges,
  addNewCustomBadge,
  updateMemberProfile,
  setSelectedMember,
  setSearchQuery,
  setFilterBadge,
  setFilterRole,
  setFilterCity,
} = membersSlice.actions;

export default membersSlice.reducer;
