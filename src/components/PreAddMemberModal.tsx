import React from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setPreAddModalOpen, addToast } from '../store/slices/uiSlice';
import { addMemberByPhone } from '../store/slices/membersSlice';
import { useMemberRegistration } from '../reducers/useMemberRegistrationReducer';
import { X, UserPlus, Phone, MapPin, Award, Shield, AlertCircle, Camera } from 'lucide-react';
import { BadgeType, UserRole } from '../types';

export const PreAddMemberModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isPreAddModalOpen);
  const { state, dispatch: formDispatch, validate } = useMemberRegistration();

  if (!isOpen) return null;

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

  const roles: { key: UserRole; label: string }[] = [
    { key: 'GENERAL_MEMBER', label: 'General Member' },
    { key: 'CORE_MEMBER', label: 'Core Member' },
    { key: 'ADMIN', label: 'Admin Board Member' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    dispatch(addMemberByPhone({
      name: state.name,
      phone: state.phone,
      email: state.email,
      photoUrl: state.photoUrl,
      address: state.address,
      city: state.city,
      bio: state.bio,
      role: state.role,
      badges: state.badges,
      occupation: state.occupation,
      company: state.company,
      birthday: state.birthday,
      anniversary: state.anniversary || undefined,
    }));

    dispatch(setPreAddModalOpen(false));
    formDispatch({ type: 'RESET' });
    dispatch(addToast({
      title: 'Member Added by Phone! 📱',
      message: `${state.name} (${state.phone}) has been pre-registered into the club database.`,
      type: 'success'
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                Admin Console
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mt-1">Pre-Add Member by Phone</h3>
            <p className="text-xs text-gray-500">Backend onboarding for verified members, badges & details</p>
          </div>
          <button
            onClick={() => dispatch(setPreAddModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto overflow-x-hidden py-4 space-y-4 flex-1 pr-1 w-full min-w-0">
          {/* Phone Number & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Phone Number (Key Identifier) <span className="text-indigo-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <input
                  type="tel"
                  required
                  value={state.phone}
                  onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'phone', value: e.target.value })}
                  placeholder="+91 98201 00000"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>
              {state.errors.phone && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {state.errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Full Name <span className="text-indigo-600">*</span>
              </label>
              <input
                type="text"
                required
                value={state.name}
                onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {state.errors.name && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {state.errors.name}
                </p>
              )}
            </div>
          </div>

          {/* Email & Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={state.email}
                onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                placeholder="yash@club.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Avatar / Photo URL</label>
              <input
                type="url"
                value={state.photoUrl}
                onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'photoUrl', value: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Residential Address <span className="text-indigo-600">*</span>
              </label>
              <input
                type="text"
                required
                value={state.address}
                onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'address', value: e.target.value })}
                placeholder="Flat / Bungalow / Street address"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {state.errors.address && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {state.errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                City <span className="text-indigo-600">*</span>
              </label>
              <input
                type="text"
                required
                value={state.city}
                onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'city', value: e.target.value })}
                placeholder="e.g. Mumbai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* About Yourself (Bio) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              About Yourself (Bio) <span className="text-indigo-600">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={state.bio}
              onChange={(e) => formDispatch({ type: 'SET_FIELD', field: 'bio', value: e.target.value })}
              placeholder="Background, sports interests, community involvement..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {state.errors.bio && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {state.errors.bio}
              </p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Club Role Assignment</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => formDispatch({ type: 'SET_FIELD', field: 'role', value: r.key })}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition ${
                    state.role === r.key
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Allocation Chips */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Assign Badges to Member:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableBadges.map((badge) => {
                const isSelected = state.badges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => formDispatch({ type: 'TOGGLE_BADGE', badge })}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-2 ring-indigo-600/20'
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200/80'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {badge}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => dispatch(setPreAddModalOpen(false))}
              className="btn-secondary py-2 px-5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-2 px-6 text-xs"
            >
              Pre-Register Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
