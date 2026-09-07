import React from 'react';
import { useAppDispatch } from '../../store';
import { 
  setCategoryFilter 
} from '../../store/slices/expensesSlice';
import { setExpenseModalOpen } from '../../store/slices/uiSlice';
import { useExpenseLedger } from '../../hooks/useExpenseLedger';
import { useAuth } from '../../hooks/useAuth';
import { ExpenseCategory } from '../../types';
import { 
  Wallet, 
  CheckCircle2, 
  Clock, 
  FileText, 
  PlusCircle, 
  TrendingUp, 
  XCircle, 
  PieChart
} from 'lucide-react';

export const ExpensesTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { metrics, filteredExpenses, categoryFilter } = useExpenseLedger();
  const { isCoreMember } = useAuth();

  const categories: ExpenseCategory[] = [
    'Venue & Facility',
    'Catering & Dining',
    'Logistics & Travel',
    'Marketing & Media',
    'Sound & Production',
    'Equipment & Sports',
    'Miscellaneous',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Refined Header */}
      <div className="text-center max-w-2xl mx-auto pt-1 pb-2 sm:pb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gray-100/90 text-gray-600 text-[11px] font-semibold mb-2 border border-gray-200/70 shadow-2xs">
          <span>Financial Governance</span>
          <span className="text-gray-300">•</span>
          <span className="text-purple-700 font-bold">Expense Ledger</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Club Expense Ledger
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg mx-auto">
          Balance sheet, itemized vendor disbursements, and authorized claims.
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="card-luxury p-5 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Annual Budget</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            ₹{metrics.totalBudgetLimit.toLocaleString()}
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            FY 2026-27 Allocated Fund
          </p>
        </div>

        {/* Total Approved Spent */}
        <div className="card-luxury p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Disbursed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">
            ₹{metrics.totalApprovedSpent.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            {metrics.budgetUtilization}% utilized
          </p>
        </div>

        {/* Available Balance */}
        <div className="card-luxury p-5 border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Balance</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-900 mt-2">
            ₹{metrics.availableBalance.toLocaleString()}
          </div>
          <p className="text-xs text-blue-700 font-semibold mt-1">
            Unallocated Reserves
          </p>
        </div>

        {/* Pending Requests Queue */}
        <div className="card-luxury p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Claims</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">
            ₹{metrics.totalPendingRequestsAmount.toLocaleString()}
          </div>
          <p className="text-xs text-amber-700 font-semibold mt-1">
            {metrics.pendingRequestsCount} claim{metrics.pendingRequestsCount !== 1 ? 's' : ''} in review
          </p>
        </div>
      </div>

      {/* Core Member Action Bar (Light Luxury Executive Card) */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/60 rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-100">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100/90 text-indigo-700 flex items-center justify-center border border-indigo-200/80 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              Core Member Reimbursement Portal
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                Authorized Access
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isCoreMember
                ? 'Submit an invoice or vendor bill for club committee review & reimbursement.'
                : 'Expense submission is restricted to Core Members. Regular members have full view-only transparency.'}
            </p>
          </div>
        </div>

        {isCoreMember ? (
          <button
            onClick={() => dispatch(setExpenseModalOpen(true))}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Submit Expense Claim</span>
          </button>
        ) : (
          <span className="text-xs text-gray-500 font-medium bg-white/80 border border-gray-200 px-3 py-1.5 rounded-full shrink-0 shadow-2xs">
            🔒 Core Member Only Feature
          </span>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <PieChart className="w-3.5 h-3.5" /> Category:
        </span>
        <button
          onClick={() => dispatch(setCategoryFilter(null))}
          className={`pill-tab text-xs shrink-0 ${!categoryFilter ? 'pill-tab-active' : 'pill-tab-inactive'}`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => dispatch(setCategoryFilter(categoryFilter === cat ? null : cat))}
            className={`pill-tab text-xs shrink-0 ${categoryFilter === cat ? 'pill-tab-active' : 'pill-tab-inactive'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Comprehensive Ledger Table */}
      <div className="card-luxury overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Expense Title & Purpose</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Claimed By</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-indigo-50/20 transition duration-150">
                  {/* Title */}
                  <td className="py-3.5 px-5">
                    <div className="font-extrabold text-gray-900 text-xs">{exp.title}</div>
                    <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{exp.description}</div>
                    {exp.eventTitle && (
                      <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-1 border border-indigo-100">
                        🎯 Event: {exp.eventTitle}
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 font-semibold text-gray-700">
                    {exp.category}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-gray-900 text-sm">
                      ₹{exp.amount.toLocaleString()}
                    </div>
                  </td>

                  {/* Claimed By */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-800 text-xs">{exp.spentBy}</div>
                    <div className="text-[10px] text-gray-400">{exp.spentByRole.replace('_', ' ')}</div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-gray-600 font-medium">
                    {exp.date}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      exp.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : exp.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {exp.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                      {exp.status === 'PENDING_APPROVAL' && <Clock className="w-3 h-3" />}
                      {exp.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      <span>{exp.status.replace('_', ' ')}</span>
                    </span>
                  </td>

                  {/* Receipt Link */}
                  <td className="py-3.5 px-5 text-right">
                    {exp.receiptUrl ? (
                      <a
                        href={exp.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Bill</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">No receipt</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
