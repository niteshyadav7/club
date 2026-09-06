import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setSelectedEvent } from '../store/slices/eventsSlice';
import { InstagramIcon } from './Icons';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  PieChart, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedEvent = useAppSelector((state) => state.events.selectedEvent);

  if (!selectedEvent) return null;

  const handleClose = () => {
    dispatch(setSelectedEvent(null));
  };

  const budgetUtilization = Math.round((selectedEvent.budgetSpent / selectedEvent.totalBudget) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition backdrop-blur-sm shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto overflow-x-hidden space-y-6 pr-1 w-full min-w-0">
          {/* Top Hero Media Cover */}
          <div className="relative -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 h-64 sm:h-72 overflow-hidden">
            <img
              src={selectedEvent.coverImage}
              alt={selectedEvent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                  selectedEvent.isPast
                    ? 'bg-white/20 backdrop-blur-md text-white border border-white/30'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {selectedEvent.isPast ? 'Past Event & Highlights' : 'Upcoming Club Event'}
                </span>
                {selectedEvent.attendeesCount && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/40 text-gray-200 backdrop-blur-md flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {selectedEvent.attendeesCount} Attendees
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {selectedEvent.title}
              </h2>
              {selectedEvent.subtitle && (
                <p className="text-xs sm:text-sm text-gray-200 mt-1">{selectedEvent.subtitle}</p>
              )}
            </div>
          </div>

          {/* Event Meta Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Date</div>
                <div className="text-xs font-bold text-gray-900">{selectedEvent.date}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Time</div>
                <div className="text-xs font-bold text-gray-900">{selectedEvent.time || 'All Day'}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Venue</div>
                <div className="text-xs font-bold text-gray-900 leading-tight">{selectedEvent.venue}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Event Overview
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>

          {/* Highlights */}
          {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Key Highlights & Milestones:
              </h4>
              <ul className="space-y-2">
                {selectedEvent.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instagram Post & Reel Embed Links */}
          {selectedEvent.instagramLinks && selectedEvent.instagramLinks.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/60 via-purple-50/40 to-orange-50/60 border border-pink-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-700 text-white flex items-center justify-center shadow-sm">
                    <InstagramIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Instagram Media & Reels</h4>
                    <p className="text-[11px] text-gray-500">Official club event posts & member reels</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {selectedEvent.instagramLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 text-xs font-semibold border border-gray-200 shadow-sm transition hover:shadow group"
                  >
                    <InstagramIcon className="w-4 h-4 text-pink-600" />
                    <span>View Reel / Post #{idx + 1}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-700" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Transparent Itemized Budget Spend Breakdown */}
          <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900">Itemized Budget Transparency</h4>
                  <p className="text-[11px] text-gray-500">Exact breakdown of funds spent for complete clarity</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500 font-medium">Total Spent vs Allocated</div>
                <div className="text-sm font-extrabold text-indigo-600">
                  ₹{selectedEvent.budgetSpent.toLocaleString()} / ₹{selectedEvent.totalBudget.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                <span>Budget Utilization</span>
                <span>{budgetUtilization}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, budgetUtilization)}%` }}
                ></div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-2">Expense Category</th>
                    <th className="pb-2">Description / Vendor</th>
                    <th className="pb-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedEvent.budgetBreakdown.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-2.5 font-bold text-gray-900">{item.category}</td>
                      <td className="py-2.5 text-gray-600">{item.description}</td>
                      <td className="py-2.5 text-right font-extrabold text-indigo-600">
                        ₹{item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
          <button
            onClick={handleClose}
            className="btn-secondary px-6 py-2 text-xs"
          >
            Close Event Details
          </button>
        </div>
      </div>
    </div>
  );
};
