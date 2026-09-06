import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setProfileEditModalOpen } from '../store/slices/uiSlice';
import { updateMemberProfile } from '../store/slices/membersSlice';
import { updateCurrentProfile } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { InstagramIcon, LinkedinIcon } from './Icons';
import { UserAvatar } from './UserAvatar';
import { X, Camera, MapPin, User, Phone, Mail, Globe, Calendar } from 'lucide-react';

export const ProfileEditModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isProfileEditModalOpen = useAppSelector((state) => state.ui.isProfileEditModalOpen);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    photoUrl: currentUser?.photoUrl || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    bio: currentUser?.bio || '',
    occupation: currentUser?.occupation || '',
    company: currentUser?.company || '',
    birthday: currentUser?.birthday || '',
    anniversary: currentUser?.anniversary || '',
    instagram: currentUser?.socialLinks?.instagram || '',
    linkedin: currentUser?.socialLinks?.linkedin || '',
    website: currentUser?.socialLinks?.website || '',
  });

  if (!isProfileEditModalOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = {
      ...currentUser,
      name: formData.name,
      phone: formData.phone,
      photoUrl: formData.photoUrl,
      address: formData.address,
      city: formData.city,
      bio: formData.bio,
      occupation: formData.occupation,
      company: formData.company,
      birthday: formData.birthday,
      anniversary: formData.anniversary || undefined,
      socialLinks: {
        instagram: formData.instagram || undefined,
        linkedin: formData.linkedin || undefined,
        website: formData.website || undefined,
      },
    };

    dispatch(updateMemberProfile(updated));
    dispatch(updateCurrentProfile(updated));
    dispatch(setProfileEditModalOpen(false));
    dispatch(addToast({
      title: 'Profile Updated',
      message: 'Your profile details have been saved successfully.',
      type: 'success'
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Edit Member Profile</h3>
            <p className="text-xs text-gray-500">Update your bio, photo, address, and community visibility</p>
          </div>
          <button
            onClick={() => dispatch(setProfileEditModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto overflow-x-hidden py-4 space-y-4 flex-1 pr-1 w-full min-w-0">
          {/* Avatar Preview */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 w-full min-w-0">
            <div className="relative shrink-0">
              <UserAvatar
                member={{ ...currentUser, photoUrl: formData.photoUrl, email: formData.email, name: formData.name }}
                className="w-16 h-16 rounded-2xl ring-2 ring-indigo-600/30"
              />
              <span className="absolute bottom-0 right-0 p-1 rounded-full bg-indigo-600 text-white shadow">
                <Camera className="w-3 h-3" />
              </span>
            </div>
            <div className="flex-1 w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1">Avatar / Photo URL</label>
              <input
                type="url"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                placeholder="https://..."
                className="w-full min-w-0 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full min-w-0">
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* About Yourself (Bio) */}
          <div className="w-full min-w-0">
            <label className="block text-xs font-bold text-gray-700 mb-1">
              About Yourself (Bio) <span className="text-indigo-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell fellow members about your background, interests in golf, profession, and sports..."
              className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Address & City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full min-w-0">
            <div className="sm:col-span-2 w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1">Residential Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Bungalow / Flat / Street"
                className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Mumbai"
                className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Profession & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full min-w-0">
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1">Profession / Title</label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Managing Director"
                className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Apex Enterprises"
                className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Birthday & Anniversary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full min-w-0">
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Birthday (for Wishes)
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                Wedding Anniversary (Optional)
              </label>
              <input
                type="date"
                value={formData.anniversary}
                onChange={(e) => setFormData({ ...formData, anniversary: e.target.value })}
                className="w-full min-w-0 px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full min-w-0">
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" /> Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full min-w-0 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" /> LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full min-w-0 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="w-full min-w-0">
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-indigo-600" /> Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
                className="w-full min-w-0 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => dispatch(setProfileEditModalOpen(false))}
              className="btn-secondary py-2 px-5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-2 px-6 text-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
