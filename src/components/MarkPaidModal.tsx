import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setMarkPaidModalOpen, addToast } from '../store/slices/uiSlice';
import { markDueAsPaid } from '../store/slices/duesSlice';
import { updateMemberProfile } from '../store/slices/membersSlice';
import { X, CheckCircle2, Receipt, Calendar, CreditCard } from 'lucide-react';

export const MarkPaidModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isMarkPaidModalOpen);
  const dueId = useAppSelector((state) => state.ui.selectedDueIdForPayment);
  const dues = useAppSelector((state) => state.dues.dues);
  const members = useAppSelector((state) => state.members.members);

  const selectedDue = dues.find((d) => d.id === dueId);

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank Transfer' | 'Cash' | 'Card'>('UPI');
  const [receiptNo, setReceiptNo] = useState(`REC-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || !selectedDue) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(markDueAsPaid({
      dueId: selectedDue.id,
      receiptNo,
      paymentMethod,
      paidDate,
    }));

    // Also update member's dues status in members slice
    const member = members.find((m) => m.id === selectedDue.memberId);
    if (member) {
      dispatch(updateMemberProfile({
        ...member,
        duesStatus: 'PAID',
      }));
    }

    dispatch(setMarkPaidModalOpen({ open: false }));
    dispatch(addToast({
      title: 'Payment Recorded! 🧾',
      message: `₹${selectedDue.amount.toLocaleString()} marked as PAID for ${selectedDue.memberName} (${receiptNo})`,
      type: 'success'
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-gray-100 relative overflow-hidden">
        <button
          onClick={() => dispatch(setMarkPaidModalOpen({ open: false }))}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Record Dues Payment</h3>
            <p className="text-xs text-gray-500">Update dues status & generate receipt</p>
          </div>
        </div>

        {/* Member Summary Card */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3 mb-4">
          <img
            src={selectedDue.memberPhoto}
            alt={selectedDue.memberName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="text-xs font-bold text-gray-900">{selectedDue.memberName}</div>
            <div className="text-[11px] text-gray-500">{selectedDue.period}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-indigo-600">
              ₹{selectedDue.amount.toLocaleString()}
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              {selectedDue.status}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Receipt / Transaction No.</label>
            <input
              type="text"
              required
              value={receiptNo}
              onChange={(e) => setReceiptNo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e: any) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
              <option value="Bank Transfer">NEFT / RTGS / IMPS Bank Transfer</option>
              <option value="Card">Credit / Debit Card</option>
              <option value="Cash">Cash at Clubhouse Counter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Payment Date</label>
            <input
              type="date"
              required
              value={paidDate}
              onChange={(e) => setPaidDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={() => dispatch(setMarkPaidModalOpen({ open: false }))}
              className="flex-1 btn-secondary text-xs py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary text-xs py-2"
            >
              Confirm & Mark Paid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
