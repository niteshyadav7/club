import { useReducer } from 'react';
import { ExpenseCategory } from '../types';

interface ExpenseFormState {
  title: string;
  amount: string;
  category: ExpenseCategory;
  eventId: string;
  eventTitle: string;
  description: string;
  receiptName: string;
  receiptUrl: string;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

type ExpenseFormAction =
  | { type: 'SET_FIELD'; field: keyof ExpenseFormState; value: any }
  | { type: 'SET_RECEIPT'; name: string; url: string }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET' };

const initialExpenseFormState: ExpenseFormState = {
  title: '',
  amount: '',
  category: 'Venue & Facility',
  eventId: '',
  eventTitle: '',
  description: '',
  receiptName: '',
  receiptUrl: '',
  isSubmitting: false,
  errors: {},
};

function expenseFormReducer(state: ExpenseFormState, action: ExpenseFormAction): ExpenseFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: '' },
      };
    case 'SET_RECEIPT':
      return {
        ...state,
        receiptName: action.name,
        receiptUrl: action.url,
        errors: { ...state.errors, receipt: '' },
      };
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
      return initialExpenseFormState;
    default:
      return state;
  }
}

export function useExpenseForm() {
  const [state, dispatch] = useReducer(expenseFormReducer, initialExpenseFormState);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!state.title.trim()) errors.title = 'Expense title is required';
    if (!state.amount || isNaN(Number(state.amount)) || Number(state.amount) <= 0) {
      errors.amount = 'Please enter a valid positive amount';
    }
    if (!state.description.trim()) errors.description = 'Justification / Description is required';
    
    dispatch({ type: 'SET_ERRORS', errors });
    return Object.keys(errors).length === 0;
  };

  return { state, dispatch, validate };
}
