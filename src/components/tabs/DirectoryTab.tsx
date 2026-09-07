import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  setSelectedMember, 
  setSearchQuery, 
  setFilterBadge, 
} from '../../store/slices/membersSlice';
import { setMemberDetailModalOpen } from '../../store/slices/uiSlice';
import { Member, BadgeType } from '../../types';
import { 
  Search, 
  Award, 
  MapPin, 
  Eye, 
  CheckCircle2, 
  Briefcase
} from 'lucide-react';
import { UserAvatar } from '../UserAvatar';

export const DirectoryTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { members, searchQuery, filterBadge, filterRole } = useAppSelector((state) => state.members);

  const availableBadges: BadgeType[] = [
    'Founding Member',
    'Core Member',
    'VIP Member',
    'Treasurer',
    'Event Organizer',
    'Star Contributor',
    'Youth Lead',
    'Honorary Member',
  ];

  const badgeColors: Record<string, string> = {
    'Founding Member': 'bg-purple-100 text-purple-800 border-purple-200',
    'Core Member': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'VIP Member': 'bg-amber-100 text-amber-900 border-amber-200',
    'Treasurer': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Event Organizer': 'bg-blue-100 text-blue-800 border-blue-200',
    'Star Contributor': 'bg-rose-100 text-rose-800 border-rose-200',
    'Youth Lead': 'bg-teal-100 text-teal-800 border-teal-200',
    'Honorary Member': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  const filteredMembers = members.filter((m: Member) => {
    // Only show verified members in public directory
    if (m.verificationStatus !== 'VERIFIED') return false;

    // Do NOT show system administrators in the public club member directory
    if (m.role === 'ADMIN' || m.email?.toLowerCase().trim() === 'superadmin@gmail.com') return false;

    const matchesSearch =
      searchQuery === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      (m.occupation && m.occupation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.bio && m.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBadge = !filterBadge || (m.badges && m.badges.includes(filterBadge as BadgeType));
    const matchesRole = !filterRole || m.role === filterRole;

    return matchesSearch && matchesBadge && matchesRole;
  });

  const handleOpenMember = (member: Member) => {
    dispatch(setSelectedMember(member));
    dispatch(setMemberDetailModalOpen(true));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Refined Header */}
      <div className="text-center max-w-2xl mx-auto pt-1 pb-2 sm:pb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gray-100/90 text-gray-600 text-[11px] font-semibold mb-2 border border-gray-200/70 shadow-2xs">
          <span>Community Directory</span>
          <span className="text-gray-300">•</span>
          <span className="text-indigo-600 font-bold">{filteredMembers.length} Members</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Club Member Network
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg mx-auto">
          Explore fellow club members, leadership profiles, and custom badges.
        </p>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search by name, city, profession, or bio..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50/50 focus:bg-white"
            />
          </div>
        </div>

        {/* Badge Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-500" /> Filter Badge:
          </span>
          <button
            onClick={() => dispatch(setFilterBadge(null))}
            className={`pill-tab text-xs shrink-0 ${!filterBadge ? 'pill-tab-active' : 'pill-tab-inactive'}`}
          >
            All Badges
          </button>
          {availableBadges.map((badge: BadgeType) => (
            <button
              key={badge}
              onClick={() => dispatch(setFilterBadge(filterBadge === badge ? null : badge))}
              className={`pill-tab text-xs shrink-0 ${filterBadge === badge ? 'pill-tab-active' : 'pill-tab-inactive'}`}
            >
              {badge}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member: Member) => (
            <div
              key={member.id}
              className="card-luxury p-5 flex flex-col justify-between group hover:border-indigo-300 hover:shadow-soft transition-all duration-300 relative overflow-hidden"
            >
              {/* Member Card Header */}
              <div>
                <div className="flex items-start gap-3.5 mb-3.5">
                  <div className="relative shrink-0">
                    <UserAvatar
                      member={member}
                      className="w-14 h-14 rounded-2xl ring-2 ring-gray-100 group-hover:ring-indigo-600 transition duration-300"
                    />
                    {member.verificationStatus === 'VERIFIED' && (
                      <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-indigo-600 text-white ring-2 ring-white">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-base font-black text-gray-900 truncate group-hover:text-indigo-600 transition">
                        {member.name}
                      </h3>
                    </div>
                    {member.occupation && (
                      <p className="text-xs text-gray-500 font-medium truncate flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{member.occupation} {member.company ? `at ${member.company}` : ''}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span>{member.city}, {member.state || 'India'}</span>
                    </p>
                  </div>
                </div>

                {/* Badges Chips */}
                {member.badges && member.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {member.badges.map((badge: BadgeType) => (
                      <span
                        key={badge}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColors[badge] || 'bg-gray-100 text-gray-700 border-gray-200'}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Dynamic Custom Fields Tags preview */}
                {member.customFields && Object.keys(member.customFields).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {Object.entries(member.customFields).slice(0, 3).map(([k, v]) => (
                      <span key={k} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {k}: {v}
                      </span>
                    ))}
                    {Object.keys(member.customFields).length > 3 && (
                      <span className="text-[9px] text-gray-400 font-bold self-center">
                        +{Object.keys(member.customFields).length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* About Yourself (Bio Snippet) */}
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4 bg-gray-50/60 p-2.5 rounded-xl border border-gray-100">
                  {member.bio || 'Club member profile.'}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <span className="text-gray-400">Dues:</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    member.duesStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : member.duesStatus === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {member.duesStatus}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenMember(member)}
                  className="btn-secondary py-1.5 px-3.5 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-200 p-8">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-800">No matching members found</h3>
          <p className="text-xs text-gray-500 mt-1">Try adjusting your search query or badge filter.</p>
        </div>
      )}
    </div>
  );
};
