import React from 'react';
import { useAppDispatch } from '../../store';
import { setStatusFilter, setDuesSearchQuery } from '../../store/slices/duesSlice';
import { useDuesMetrics } from '../../hooks/useDuesMetrics';
import { 
  ReceiptText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search
} from 'lucide-react';

export const DuesTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { metrics, filteredDues, statusFilter, searchQuery } = useDuesMetrics();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Refined Header */}
      <div className="text-center max-w-2xl mx-auto pt-1 pb-2 sm:pb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gray-100/90 text-gray-600 text-[11px] font-semibold mb-2 border border-gray-200/70 shadow-2xs">
          <span>Financial Hub</span>
          <span className="text-gray-300">•</span>
          <span className="text-emerald-700 font-bold">Public Ledger</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Club Dues & Collections
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg mx-auto">
          Transparent ledger showing real-time annual dues, collection status, and receipts.
        </p>
      </div>

      {/* Metrics Row (4 Luxury KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="card-luxury p-5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Collected</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            ₹{metrics.totalCollected.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            {metrics.paidCount} members paid
          </p>
        </div>

        {/* Total Pending */}
        <div className="card-luxury p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Dues</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            ₹{metrics.totalPending.toLocaleString()}
          </div>
          <p className="text-xs text-amber-700 font-semibold mt-1">
            {metrics.pendingCount} members pending
          </p>
        </div>

        {/* Overdue */}
        <div className="card-luxury p-5 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overdue Dues</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mt-2">
            ₹{metrics.totalOverdue.toLocaleString()}
          </div>
          <p className="text-xs text-rose-700 font-semibold mt-1">
            {metrics.overdueCount} members overdue
          </p>
        </div>

        {/* Collection Efficiency */}
        <div className="card-luxury p-5 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Collection Rate</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">
            {metrics.collectionRate}%
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${metrics.collectionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setDuesSearchQuery(e.target.value))}
            placeholder="Search dues by member name, phone, or receipt..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50/50"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => dispatch(setStatusFilter(status))}
                className={`pill-tab text-xs shrink-0 ${isActive ? 'pill-tab-active' : 'pill-tab-inactive'}`}
              >
                {status === 'ALL' ? 'All Records' : status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transparent Dues Table */}
      <div className="card-luxury overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Member</th>
                <th className="py-3.5 px-4">Period / Invoice</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Receipt Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDues.length > 0 ? (
                filteredDues.map((item) => (
                  <tr key={item.id} className="hover:bg-indigo-50/20 transition duration-150">
                    {/* Member */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.memberPhoto}
                          alt={item.memberName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div>
                          <div className="font-extrabold text-gray-900 text-xs">{item.memberName}</div>
                          <div className="text-[11px] text-gray-400">{item.memberPhone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Period */}
                    <td className="py-3.5 px-4 font-semibold text-gray-700">
                      {item.period}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-gray-900 text-sm">
                        ₹{item.amount.toLocaleString()}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {item.dueDate}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {item.status === 'OVERDUE' && <AlertTriangle className="w-3 h-3" />}
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Receipt Details */}
                    <td className="py-3.5 px-5 text-right">
                      {item.status === 'PAID' ? (
                        <div className="inline-block text-right">
                          <div className="font-bold text-gray-900 text-[11px] flex items-center justify-end gap-1">
                            <ReceiptText className="w-3.5 h-3.5 text-indigo-600" />
                            {item.receiptNo}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Paid via {item.paymentMethod || 'UPI'} on {item.paidDate}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">No receipt generated yet</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No dues records match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
