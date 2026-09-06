import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { addEvent } from '../store/slices/eventsSlice';
import { addAuditLog } from '../store/slices/auditSlice';
import { addToast } from '../store/slices/uiSlice';
import { InstagramIcon } from './Icons';
import { X, Calendar, MapPin, Plus, Trash2, PieChart, Sparkles } from 'lucide-react';
import { BudgetItem, ClubEvent } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('06:00 PM - 11:00 PM');
  const [venue, setVenue] = useState('Grand Lawn & Ballroom');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80');
  const [highlightsText, setHighlightsText] = useState('Gourmet Dinner Buffet\nLive Acoustic Music\nMembers Trophy Presentation');
  const [instagramLinksText, setInstagramLinksText] = useState('https://www.instagram.com/p/C-preview1/');
  const [totalBudget, setTotalBudget] = useState('300000');

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: 'b-init-1', category: 'Venue & Decor', amount: 120000, description: 'Lawn lighting, flower setup, stage' },
    { id: 'b-init-2', category: 'Catering & Beverages', amount: 130000, description: 'Banquet dinner for 80 attendees' },
    { id: 'b-init-3', category: 'Music & DJ', amount: 50000, description: 'Stage sound and artist fee' },
  ]);

  const [newItemCat, setNewItemCat] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');

  if (!isOpen) return null;

  const handleAddBudgetItem = () => {
    if (!newItemCat || !newItemAmount) return;
    setBudgetItems([
      ...budgetItems,
      {
        id: `b-${Date.now()}`,
        category: newItemCat,
        amount: Number(newItemAmount),
        description: newItemDesc || 'Expenditure',
      }
    ]);
    setNewItemCat('');
    setNewItemAmount('');
    setNewItemDesc('');
  };

  const handleRemoveBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(b => b.id !== id));
  };

  const totalSpentCalculated = budgetItems.reduce((acc, curr) => acc + curr.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const highlights = highlightsText.split('\n').map(h => h.trim()).filter(Boolean);
    const instagramLinks = instagramLinksText.split('\n').map(l => l.trim()).filter(Boolean);

    const newEvent: ClubEvent = {
      id: `evt-${Date.now()}`,
      title,
      subtitle: subtitle || undefined,
      date,
      time,
      venue,
      description,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80',
      galleryImages: [],
      highlights,
      instagramLinks,
      totalBudget: Number(totalBudget),
      budgetSpent: totalSpentCalculated,
      budgetBreakdown: budgetItems,
      isPast: false,
      attendeesCount: 60,
    };

    dispatch(addEvent(newEvent));

    dispatch(addAuditLog({
      action: 'Published New Club Event & Budget',
      performedBy: `${currentUser?.name || 'Admin'} (${currentUser?.role.replace('_', ' ') || 'Admin'})`,
      target: `${title} (Budget: ₹${Number(totalBudget).toLocaleString()})`,
      type: 'EVENT'
    }));

    dispatch(addToast({
      title: 'Event Published! 📅',
      message: `"${title}" has been added with complete itemized budget transparency.`,
      type: 'success'
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Publish New Club Event</h3>
            <p className="text-xs text-gray-500">Configure event details, Instagram embeds, and itemized budget spend</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto overflow-x-hidden space-y-4 flex-1 pr-1 w-full min-w-0">
          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Solstice Golf & Poolside Gala"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tagline / Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. 18-Hole scramble followed by live entertainment"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Date, Time, Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Event Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Time Range</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="06:00 PM - 11:00 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Venue *</label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Fairway Pavilion & Lawn"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event background, schedule, participation details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Highlights & Instagram Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Key Highlights (1 per line)</label>
              <textarea
                rows={3}
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                placeholder="Highlight 1&#10;Highlight 2"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />
                Instagram Post / Reel Links (1 per line)
              </label>
              <textarea
                rows={3}
                value={instagramLinksText}
                onChange={(e) => setInstagramLinksText(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Itemized Budget Builder */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-gray-900 uppercase">Itemized Budget Transparency</h4>
              </div>
              <div className="text-xs text-indigo-600 font-extrabold">
                Total Budget: ₹{Number(totalBudget).toLocaleString()} | Spent: ₹{totalSpentCalculated.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">Overall Allocated Event Budget (₹)</label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* List of Budget Breakdown Items */}
            <div className="space-y-2">
              {budgetItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200 text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{item.category}:</span>{' '}
                    <span className="text-gray-600">{item.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-indigo-600">₹{item.amount.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBudgetItem(item.id)}
                      className="text-gray-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Item Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-200">
              <input
                type="text"
                value={newItemCat}
                onChange={(e) => setNewItemCat(e.target.value)}
                placeholder="Category (e.g. Audio/DJ)"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
              />
              <input
                type="number"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                placeholder="Amount (₹)"
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Vendor / Note"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddBudgetItem}
                  className="btn-indigo px-3 py-1 text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2 px-5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-2 px-6 text-xs"
            >
              Publish Event & Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
