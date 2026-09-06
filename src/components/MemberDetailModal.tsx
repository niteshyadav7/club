import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setSelectedMember } from '../store/slices/membersSlice';
import { setMemberDetailModalOpen, addToast } from '../store/slices/uiSlice';
import { InstagramIcon, LinkedinIcon } from './Icons';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  Award, 
  Calendar, 
  Globe, 
  ShieldCheck,
  Heart,
  Cake,
  Receipt,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

export const MemberDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isMemberDetailModalOpen);
  const member = useAppSelector((state) => state.members.selectedMember);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !member) return null;

  const handleClose = () => {
    dispatch(setMemberDetailModalOpen(false));
    dispatch(setSelectedMember(null));
  };

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    dispatch(addToast({
      title: `${label} Copied`,
      message: `${text} copied to clipboard.`,
      type: 'info'
    }));
    setTimeout(() => setCopiedField(null), 2000);
  };

  const badgeColors: Record<string, string> = {
    'Founding Member': 'bg-purple-50 text-purple-700 border-purple-200 shadow-2xs',
    'Core Member': 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs',
    'VIP Member': 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs',
    'Treasurer': 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs',
    'Event Organizer': 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs',
    'Star Contributor': 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs',
    'Youth Lead': 'bg-teal-50 text-teal-700 border-teal-200 shadow-2xs',
    'Honorary Member': 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col relative overflow-hidden">
        
        {/* Floating Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/95 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition border border-gray-200/80 shadow-2xs cursor-pointer active:scale-95"
          aria-label="Close Profile"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto overflow-x-hidden space-y-5 pr-0.5 w-full min-w-0">
          
          {/* ─── 1. TOP LIGHT LUXURY EXECUTIVE HEADER ─── */}
          <div className="relative -mx-5 sm:-mx-7 -mt-5 sm:-mt-7 p-5 sm:p-7 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/70 border-b border-indigo-100/80">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
              
              {/* Member Avatar with Verified Beacon */}
              <div className="relative shrink-0">
                <UserAvatar
                  member={member}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ring-4 ring-white shadow-md border border-indigo-100/60"
                />
                {member.verificationStatus === 'VERIFIED' && (
                  <span 
                    className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-indigo-600 border-2 border-white text-white shadow-md flex items-center justify-center"
                    title="Verified Member"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </span>
                )}
              </div>

              {/* Identity & Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight truncate">
                    {member.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-indigo-100 text-indigo-700 border border-indigo-200/90 tracking-wide uppercase">
                    {member.role.replace('_', ' ')}
                  </span>
                </div>

                {member.occupation && (
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center justify-center sm:justify-start gap-1.5 mb-1.5 font-semibold truncate">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{member.occupation} {member.company ? `at ${member.company}` : ''}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{member.city}, {member.state || 'India'}</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Member since {new Date(member.joinedDate).getFullYear()}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Badges Ribbon (Light Luxury Pills) */}
            {member.badges && member.badges.length > 0 && (
              <div className="mt-4 pt-3.5 border-t border-indigo-100/70 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-wider mr-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Member Badges:
                </span>
                {member.badges.map((badge) => (
                  <span
                    key={badge}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${badgeColors[badge] || 'bg-white text-gray-700 border-gray-200'}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ─── 2. ABOUT YOURSELF BIO CARD ─── */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 shadow-2xs">
            <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              About Member
            </h4>
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
              {member.bio || 'Club member profile.'}
            </p>
          </div>

          {/* ─── 3. CONTACT INFORMATION & ADDRESS / DUES CARDS ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Contact Details */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-3">
              <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                Contact Information
              </h4>
              
              {/* Phone */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 font-bold border border-indigo-100">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-gray-400 font-medium">Phone Number</div>
                    <div className="font-bold text-gray-900 truncate">{member.phone}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(member.phone, 'Phone')}
                  className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition cursor-pointer shrink-0"
                  title="Copy Phone"
                >
                  {copiedField === 'Phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-gray-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 font-bold border border-indigo-100">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-gray-400 font-medium">Email Address</div>
                    <div className="font-bold text-gray-900 truncate" title={member.email}>{member.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(member.email, 'Email')}
                  className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition cursor-pointer shrink-0"
                  title="Copy Email"
                >
                  {copiedField === 'Email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Address & Dues Status */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-3">
              <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                Address & Dues Status
              </h4>

              {/* Address */}
              <div className="flex items-start gap-2.5 text-xs">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 font-bold border border-indigo-100">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-gray-400 font-medium">Residential Address</div>
                  <div className="font-semibold text-gray-900 leading-snug">
                    {member.address || 'Clubhouse Road'}, {member.city}
                  </div>
                </div>
              </div>

              {/* Dues Status */}
              <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-gray-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 font-bold border border-indigo-100">
                    <Receipt className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-medium">Annual Club Dues</div>
                    <div className="font-bold text-gray-900">Current Season</div>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border shrink-0 ${
                  member.duesStatus === 'PAID'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : member.duesStatus === 'PENDING'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {member.duesStatus}
                </span>
              </div>
            </div>
          </div>

          {/* ─── 4. DYNAMIC CUSTOM PRIVILEGES (IF ANY) ─── */}
          {member.customFields && Object.keys(member.customFields).length > 0 && (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-2.5">
              <h4 className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Custom Member Attributes & Privileges
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(member.customFields).map(([label, val]) => (
                  <div key={label} className="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs">
                    <div className="text-[10px] font-bold text-gray-400 uppercase truncate">{label}</div>
                    <div className="text-xs font-black text-gray-900 truncate mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── 5. MILESTONES & SOCIAL MEDIA LINKS ─── */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-50/60 via-white to-blue-50/40 border border-indigo-100/80">
            <div className="flex flex-wrap items-center gap-3.5 text-xs text-gray-600">
              {member.birthday && (
                <div className="flex items-center gap-1.5">
                  <Cake className="w-4 h-4 text-amber-500" />
                  <span>Birthday: <strong className="text-gray-900">{member.birthday}</strong></span>
                </div>
              )}
              {member.anniversary && (
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Anniversary: <strong className="text-gray-900">{member.anniversary}</strong></span>
                </div>
              )}
            </div>

            {/* Social Buttons */}
            <div className="flex items-center gap-1.5">
              {member.socialLinks?.instagram && (
                <a
                  href={member.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white hover:bg-pink-50 text-pink-600 border border-gray-200 hover:border-pink-200 transition shadow-2xs"
                  title="Instagram Profile"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {member.socialLinks?.linkedin && (
                <a
                  href={member.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white hover:bg-blue-50 text-blue-600 border border-gray-200 hover:border-blue-200 transition shadow-2xs"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {member.socialLinks?.website && (
                <a
                  href={member.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-600 border border-gray-200 hover:border-indigo-200 transition shadow-2xs"
                  title="Personal / Company Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ─── 6. FOOTER ACTIONS ─── */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end shrink-0">
          <button
            onClick={handleClose}
            className="btn-secondary px-6 py-2 text-xs font-bold shadow-2xs hover:bg-gray-100 transition cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
