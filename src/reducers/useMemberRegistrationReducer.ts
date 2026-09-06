import { useReducer } from 'react';
import { BadgeType, UserRole } from '../types';

interface MemberRegistrationState {
  name: string;
  phone: string;
  email: string;
  photoUrl: string;
  address: string;
  city: string;
  bio: string;
  occupation: string;
  company: string;
  role: UserRole;
  badges: BadgeType[];
  birthday: string;
  anniversary: string;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

type MemberRegistrationAction =
  | { type: 'SET_FIELD'; field: keyof MemberRegistrationState; value: any }
  | { type: 'TOGGLE_BADGE'; badge: BadgeType }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET' };

const initialRegistrationState: MemberRegistrationState = {
  name: '',
  phone: '',
  email: '',
  photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  address: '',
  city: 'Mumbai',
  bio: '',
  occupation: '',
  company: '',
  role: 'GENERAL_MEMBER',
  badges: ['VIP Member'],
  birthday: '1992-05-15',
  anniversary: '',
  isSubmitting: false,
  errors: {},
};

function memberRegistrationReducer(state: MemberRegistrationState, action: MemberRegistrationAction): MemberRegistrationState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: '' },
      };
    case 'TOGGLE_BADGE': {
      const exists = state.badges.includes(action.badge);
      const newBadges = exists
        ? state.badges.filter(b => b !== action.badge)
        : [...state.badges, action.badge];
      return { ...state, badges: newBadges };
    }
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting,
      };
    case 'RESET':
      return initialRegistrationState;
    default:
      return state;
  }
}

export function useMemberRegistration() {
  const [state, dispatch] = useReducer(memberRegistrationReducer, initialRegistrationState);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!state.name.trim()) errors.name = 'Full Name is required';
    if (!state.phone.trim()) errors.phone = 'Phone Number is required';
    if (state.phone.trim().length < 10) errors.phone = 'Enter a valid 10-digit phone number';
    if (!state.address.trim()) errors.address = 'Address is required';
    if (!state.city.trim()) errors.city = 'City is required';
    if (!state.bio.trim()) errors.bio = 'About Yourself / Bio is required';

    dispatch({ type: 'SET_ERRORS', errors });
    return Object.keys(errors).length === 0;
  };

  return { state, dispatch, validate };
}
