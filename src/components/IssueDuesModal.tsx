import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { issueNewDueInvoice } from '../store/slices/duesSlice';
import { addAuditLog } from '../store/slices/auditSlice';
import { addToast } from '../store/slices/uiSlice';
import { X, Receipt, IndianRupee, Calendar, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const IssueDuesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const allMembers = useAppSelector((state) => state.members.members);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const members = useMemo(() => {
    return allMembers.filter(m => m.verificationStatus === 'VERIFIED');
  }, [allMembers]);

  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [period, setPeriod] = useState('Annual Membership 2026-27');
  const [amount, setAmount] = useState('50000');
  const [dueDate, setDueDate] = useState('2026-10-31');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const targetMember = members.find(m => m.id === selectedMemberId) || members[0];
    if (!targetMember) return;

    dispatch(issueNewDueInvoice({
      memberId: targetMember.id,
      memberName: targetMember.name,
      memberEmail: targetMember.email,
      memberPhone: targetMember.phone,
      memberPhoto: targetMember.photoUrl,
      amount: Number(amount),
      period,
      dueDate,
    }));

    dispatch(addAuditLog({
      action: 'Issued New Dues Invoice',
      performedBy: `${currentUser?.name || 'Admin'} (Admin)`,
      target: `₹${Number(amount).toLocaleString()} - ${targetMember.name} (${period})`,
      type: 'DUES'
    }));

    dispatch(addToast({
      title: 'Invoice Issued! 🧾',
      message: `Dues invoice of ₹${Number(amount).toLocaleString()} created for ${targetMember.name}.`,
      type: 'success'
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-gray-100 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Issue Dues Invoice</h3>
            <p className="text-xs text-gray-500">Create new dues demand for a verified member</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Select Member</label>
            <select
              value={selectedMemberId || members[0]?.id}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.phone}) - {m.role.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Invoice / Dues Title</label>
            <input
              type="text"
              required
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="e.g. Annual Membership 2026-27 or Tournament Entry"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary text-xs py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary text-xs py-2"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
