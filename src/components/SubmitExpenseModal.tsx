import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setExpenseModalOpen, addToast } from '../store/slices/uiSlice';
import { submitExpenseRequest } from '../store/slices/expensesSlice';
import { useExpenseForm } from '../reducers/useExpenseFormReducer';
import { useAuth } from '../hooks/useAuth';
import { X, Upload, FileText, IndianRupee, Tag, Calendar, AlertCircle } from 'lucide-react';
import { ExpenseCategory } from '../types';

export const SubmitExpenseModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isExpenseModalOpen);
  const events = useAppSelector((state) => state.events.events);
  const { currentUser, isCoreMember, isAdmin } = useAuth();

  const { state, dispatch: formDispatch, validate } = useExpenseForm();

  if (!isOpen) return null;

  const categories: ExpenseCategory[] = [
    'Venue & Facility',
    'Catering & Dining',
    'Logistics & Travel',
    'Marketing & Media',
    'Sound & Production',
    'Equipment & Sports',
    'Miscellaneous',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!currentUser || (!isCoreMember && !isAdmin)) {
      dispatch(addToast({
        title: 'Access Restricted',
        message: 'Only Core Members and Admins can submit expense reimbursement requests.',
        type: 'error'
      }));
      return;
    }

    const selectedEvent = events.find((evt) => evt.id === state.eventId);

    dispatch(submitExpenseRequest({
      title: state.title,
      amount: Number(state.amount),
      category: state.category,
      spentBy: currentUser.name,
      spentByMemberId: currentUser.id,
      spentByRole: currentUser.role as 'ADMIN' | 'CORE_MEMBER',
      description: state.description,
      receiptUrl: state.receiptUrl || 'https://images.unsplash.com/photo-1554415707-9e4c29753a81?w=600&auto=format&fit=crop&q=80',
      receiptName: state.receiptName || 'Attached_Invoice_Receipt.pdf',
      eventId: state.eventId || undefined,
      eventTitle: selectedEvent?.title || undefined,
    }));

    dispatch(setExpenseModalOpen(false));
    formDispatch({ type: 'RESET' });
    dispatch(addToast({
      title: 'Expense Claim Submitted! 💸',
      message: `Your request for ₹${Number(state.amount).toLocaleString()} has been sent to the Admin Board for approval.`,
      type: 'success'
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                Core Member Facility
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mt-1">Submit Expense Claim</h3>
            <p className="text-xs text-gray-500">Request reimbursement or budget disbursement for club activities</p>
          </div>
          <button
            onClick={() => dispatch(setExpenseModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto overflow-x-hidden py-4 space-y-4 flex-1 pr-1 w-full min-w-0">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Expense / Invoice Title <span className="text-indigo-600">*</span>
            </label>
            <input
              type="text"
              required
              value={state.title}
              onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })}
              placeholder="e.g. Stage Sound & Live Music setup for Golf Gala"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {state.errors.title && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {state.errors.title}
              </p>
            )}
          </div>

          {/* Amount & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Amount (₹ INR) <span className="text-indigo-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={state.amount}
                  onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'amount', value: e.target.value })}
                  placeholder="25000"
                  className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold"
                />
              </div>
              {state.errors.amount && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {state.errors.amount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Expense Category <span className="text-indigo-600">*</span>
              </label>
              <select
                value={state.category}
                onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'category', value: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Associated Event */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Associate with Event (Optional)
            </label>
            <select
              value={state.eventId}
              onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'eventId', value: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">-- General Club Expense (Not tied to event) --</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>{evt.title} ({evt.date})</option>
              ))}
            </select>
          </div>

          {/* Justification / Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Description & Purpose <span className="text-indigo-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={state.description}
              onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
              placeholder="Provide vendor details, items purchased, and justification for the expenditure..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {state.errors.description && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {state.errors.description}
              </p>
            )}
          </div>

          {/* Receipt / Invoice Upload Simulation */}
          <div className="p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center">
            <Upload className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
            <div className="text-xs font-bold text-gray-800">
              {state.receiptName || 'Upload Bill / Receipt Attachment'}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Supports PDF, PNG, JPG receipts (Max 10MB)</p>
            <button
              type="button"
              onClick={() => {
                formDispatch({
                  type: 'SET_RECEIPT',
                  name: `Invoice_${state.category.split(' ')[0]}_${Date.now().toString().slice(-4)}.pdf`,
                  url: 'https://images.unsplash.com/photo-1554415707-9e4c29753a81?w=600&auto=format&fit=crop&q=80'
                });
              }}
              className="mt-2 text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              {state.receiptName ? 'Replace Attachment' : 'Attach Sample Vendor Invoice'}
            </button>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => dispatch(setExpenseModalOpen(false))}
              className="btn-secondary py-2 px-5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-2 px-6 text-xs"
            >
              Submit Request for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
