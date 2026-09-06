import React, { useState } from 'react';
import { useCelebrations } from '../hooks/useCelebrations';
import { Cake, Sparkles, Heart, X, Send, MessageCircle } from 'lucide-react';

export const CelebrationBanner: React.FC = () => {
  const {
    todayCelebrations,
    wishes,
    isBannerDismissed,
    handleSendWish,
    handleDismissBanner,
  } = useCelebrations();

  const [activeWishInputMemberId, setActiveWishInputMemberId] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState('');
  const [showFeedModal, setShowFeedModal] = useState(false);

  if (isBannerDismissed || todayCelebrations.length === 0) {
    return null;
  }

  return (
    <section aria-label="Celebrations Banner" className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-white rounded-3xl p-4 sm:p-5 shadow-elevated border border-indigo-800/40 relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: Icon & Description */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-gray-900 shadow-lg shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse text-gray-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/15 text-amber-200 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">
                  Today's Milestones
                </span>
                <span className="text-xs text-indigo-200 font-medium">
                  {todayCelebrations.length} celebration{todayCelebrations.length > 1 ? 's' : ''} today
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
                Let's Celebrate Our Club Members! 🎉
              </h2>
            </div>
          </div>

          {/* Center: List of Members Celebrating */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {todayCelebrations.map(({ member, type, years }) => (
              <div
                key={`${member.id}-${type}`}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 pr-3.5 flex items-center gap-3 border border-white/15 hover:border-white/30 transition"
              >
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/30"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    {member.name}
                    {type === 'BIRTHDAY' ? (
                      <Cake className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                    )}
                  </div>
                  <div className="text-[11px] text-indigo-200 font-medium">
                    {type === 'BIRTHDAY' ? 'Birthday Today 🎂' : `${years || ''}th Anniversary 💐`}
                  </div>
                </div>

                <button
                  onClick={() => handleSendWish(member, type)}
                  className="ml-2 bg-white text-gray-900 hover:bg-amber-100 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Wish</span>
                </button>
              </div>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setShowFeedModal(true)}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer"
              title="View all wishes"
            >
              <MessageCircle className="w-3.5 h-3.5 text-indigo-300" />
              <span>Feed ({wishes.length})</span>
            </button>

            <button
              onClick={handleDismissBanner}
              className="p-1.5 rounded-full hover:bg-white/10 text-indigo-300 hover:text-white transition cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Community Wishes Feed Modal */}
      {showFeedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">Celebration Wall & Greetings</h3>
                  <p className="text-xs text-gray-500">Live community wishes for birthdays and milestones</p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3.5 flex-1 pr-1">
              {wishes.map((w) => (
                <div key={w.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100/80">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={w.wishedByPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={w.wishedBy}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-gray-900">{w.wishedBy}</span>
                      <span className="text-[11px] text-gray-400">→ for</span>
                      <span className="text-xs font-bold text-indigo-700">{w.memberName}</span>
                    </div>
                    <span className="text-[10px] font-medium text-gray-400">{w.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pl-8">{w.message}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowFeedModal(false)}
                className="w-full btn-secondary py-2 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
