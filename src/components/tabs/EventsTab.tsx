import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSelectedEvent, setFilterType } from '../../store/slices/eventsSlice';
import { ClubEvent } from '../../types';
import { InstagramIcon } from '../Icons';
import { 
  CalendarDays, 
  MapPin, 
  PieChart, 
  ArrowRight, 
  Users, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';

export const EventsTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, filterType } = useAppSelector((state) => state.events);

  const filteredEvents = events.filter((evt) => {
    if (filterType === 'UPCOMING') return !evt.isPast;
    if (filterType === 'PAST') return evt.isPast;
    return true;
  });

  const handleOpenEvent = (event: ClubEvent) => {
    dispatch(setSelectedEvent(event));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Refined Header */}
      <div className="text-center max-w-2xl mx-auto pt-1 pb-2 sm:pb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gray-100/90 text-gray-600 text-[11px] font-semibold mb-2 border border-gray-200/70 shadow-2xs">
          <span>Events & Media</span>
          <span className="text-gray-300">•</span>
          <span className="text-amber-700 font-bold">Community Calendar</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Club Events & Media
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg mx-auto">
          Upcoming tournaments, past highlights, and complete budget spend transparency.
        </p>
      </div>

      {/* Filter Tabs (VincentGolf Pill Navigation) */}
      <div className="flex items-center justify-center gap-2">
        {(['ALL', 'UPCOMING', 'PAST'] as const).map((type) => {
          const isActive = filterType === type;
          const labels = {
            ALL: 'All Events',
            UPCOMING: 'Upcoming Events',
            PAST: 'Past Events & Highlights',
          };
          return (
            <button
              key={type}
              onClick={() => dispatch(setFilterType(type))}
              className={`pill-tab text-xs ${isActive ? 'pill-tab-active' : 'pill-tab-inactive'}`}
            >
              {labels[type]}
            </button>
          );
        })}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const budgetPercent = Math.round((evt.budgetSpent / evt.totalBudget) * 100);

          return (
            <div
              key={evt.id}
              className="card-luxury overflow-hidden flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-300"
            >
              {/* Top Media Banner */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={evt.coverImage}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      evt.isPast
                        ? 'bg-black/50 backdrop-blur-md text-white border border-white/20'
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {evt.isPast ? 'Past Event' : 'Upcoming Event'}
                    </span>

                    {evt.attendeesCount && (
                      <span className="frosted-badge flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {evt.attendeesCount} Attending
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-indigo-200 flex items-center gap-2 mb-1">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {evt.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {evt.venue}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">
                      {evt.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {evt.description}
                  </p>

                  {/* Highlights Snippet */}
                  {evt.highlights && evt.highlights.length > 0 && (
                    <div className="mt-3 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                      <div className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Highlights:
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-1">
                        ✓ {evt.highlights[0]}
                      </p>
                    </div>
                  )}

                  {/* Instagram Links */}
                  {evt.instagramLinks && evt.instagramLinks.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                        <InstagramIcon className="w-3.5 h-3.5 text-pink-600" /> Media:
                      </span>
                      {evt.instagramLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-full transition"
                        >
                          <span>Instagram #{i + 1}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Financial Budget Transparency Bar */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-gray-700 flex items-center gap-1">
                      <PieChart className="w-3.5 h-3.5 text-indigo-600" />
                      Budget Spend Transparency:
                    </span>
                    <span className="font-extrabold text-indigo-600">
                      ₹{evt.budgetSpent.toLocaleString()} / ₹{evt.totalBudget.toLocaleString()} ({budgetPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, budgetPercent)}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={() => handleOpenEvent(evt)}
                    className="w-full btn-secondary py-2 text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition"
                  >
                    <span>View Highlights & Itemized Budget Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
