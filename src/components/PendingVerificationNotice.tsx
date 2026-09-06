import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../store';
import { setCurrentUser } from '../store/slices/authSlice';
import { addToast } from '../store/slices/uiSlice';
import { getStoredMembers } from '../store/localStorageSync';
import { UserAvatar } from './UserAvatar';
import {
  Clock,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  Mail,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PendingVerificationNotice: React.FC = () => {
  const { currentUser, isPending, handleSignOut } = useAuth();
  const dispatch = useAppDispatch();
  const members = useAppSelector((state) => state.members.members);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Continuous Auto-Sync: Automatically unlocks when Super Admin approves in Admin tab or Firestore
  useEffect(() => {
    if (!isPending || !currentUser) return;

    const checkVerification = () => {
      // 1. Check Redux state
      const matched = members.find(
        (m) =>
          m.id === currentUser.id ||
          (currentUser.email && m.email?.toLowerCase() === currentUser.email.toLowerCase())
      );

      if (matched && matched.verificationStatus === 'VERIFIED') {
        dispatch(setCurrentUser(matched));
        triggerConfetti();
        dispatch(
          addToast({
            title: 'Account Approved! 🎉',
            message: `Welcome to ClubSphere, ${matched.name}! Your account is now active.`,
            type: 'success'
          })
        );
        return;
      }

      // 2. Check Shared Local/Persistent Storage
      const stored = getStoredMembers();
      const storedMatched = stored.find(
        (m) =>
          m.id === currentUser.id ||
          (currentUser.email && m.email?.toLowerCase() === currentUser.email.toLowerCase())
      );
      if (storedMatched && storedMatched.verificationStatus === 'VERIFIED') {
        dispatch(setCurrentUser(storedMatched));
        triggerConfetti();
        dispatch(
          addToast({
            title: 'Account Approved! 🎉',
            message: `Welcome to ClubSphere, ${storedMatched.name}! Your account is now active.`,
            type: 'success'
          })
        );
      }
    };

    const interval = setInterval(checkVerification, 1500);
    return () => clearInterval(interval);
  }, [isPending, currentUser, members, dispatch]);

  if (!isPending || !currentUser) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCopyId = () => {
    if (!currentUser.id) return;
    navigator.clipboard.writeText(currentUser.id);
    setCopiedId(true);
    dispatch(
      addToast({
        title: 'ID Copied',
        message: 'Application ID copied to clipboard.',
        type: 'info'
      })
    );
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCheckStatus = () => {
    setIsRefreshing(true);

    const stored = getStoredMembers();
    const allMembers = [...members, ...stored];
    const updated = allMembers.find(
      (m) =>
        m.id === currentUser.id ||
        (currentUser.email && m.email?.toLowerCase() === currentUser.email.toLowerCase())
    );

    setTimeout(() => {
      setIsRefreshing(false);
      if (updated && updated.verificationStatus === 'VERIFIED') {
        dispatch(setCurrentUser(updated));
        triggerConfetti();
        dispatch(
          addToast({
            title: 'Account Approved! 🎉',
            message: `Congratulations ${updated.name}! Your membership is active.`,
            type: 'success'
          })
        );
      } else {
        dispatch(
          addToast({
            title: 'Under Review ⏳',
            message: 'Your registration is currently in the Super Admin queue.',
            type: 'info'
          })
        );
      }
    }, 450);
  };

  const formattedJoinDate =
    currentUser.joinedDate || new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center px-4 py-4 sm:py-6 max-w-lg mx-auto text-center animate-in fade-in duration-200">
      
      {/* ─── 1. TOP BRAND HEADER BAR ─── */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs ring-1 ring-indigo-400/30">
            <span className="bg-gradient-to-tr from-indigo-300 via-sky-300 to-white bg-clip-text text-transparent">CS</span>
          </div>
          <div className="text-left">
            <div className="text-sm font-black tracking-tight flex items-center gap-1.5 leading-tight">
              <span className="text-gray-900 font-black">Club</span>
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent font-black">Sphere</span>
              <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-2xs">
                PRO
              </span>
            </div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">
              Community Governance
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 transition cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="text-[11px]">Sign Out</span>
        </button>
      </div>

      {/* ─── 2. HERO SECTION: Avatar, Live Status & Headline ─── */}
      <div className="w-full flex flex-col items-center space-y-2 py-2">
        <div className="relative">
          <div className="p-1 rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-indigo-500 shadow-md inline-block">
            <UserAvatar
              member={currentUser}
              className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-white shadow-inner"
            />
          </div>
          <div
            className="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-white rounded-full ring-2 ring-white shadow-xs"
            title="Awaiting Approval"
          >
            <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-amber-50 border border-amber-200 text-amber-900 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="tracking-wide uppercase">
            Awaiting Super Admin Approval
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Welcome, <span className="text-indigo-600">{currentUser.name}</span>!
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 max-w-sm mx-auto leading-relaxed">
            Your registration is queued in the admin review registry. Access to member directories and dues ledgers unlocks automatically upon approval.
          </p>
        </div>
      </div>

      {/* ─── 3. MIDDLE SECTION: Identity & Progress Stepper ─── */}
      <div className="w-full space-y-2.5 my-auto">
        
        {/* Email & ID Chip */}
        <div className="w-full bg-gray-50/90 border border-gray-200/90 rounded-2xl px-3 py-2 flex items-center justify-between gap-2 text-xs text-left shadow-2xs">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Mail className="w-3 h-3" />
            </div>
            <span className="font-semibold text-gray-800 text-[11px] truncate" title={currentUser.email}>
              {currentUser.email}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-500 shrink-0 border-l border-gray-200 pl-2">
            <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="font-mono font-bold text-gray-700 text-[10px] truncate max-w-[85px] sm:max-w-[120px]">
              {currentUser.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="p-1 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer transition"
              title="Copy ID"
            >
              {copiedId ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* 3-Step Governance Stepper */}
        <div className="w-full bg-gradient-to-b from-amber-50/70 to-orange-50/30 border border-amber-200/90 rounded-2xl p-3 text-left space-y-2 shadow-2xs">
          <div className="flex items-center justify-between pb-1 border-b border-amber-200/60">
            <span className="text-[10px] font-extrabold text-amber-950 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Governance Timeline
            </span>
            <span className="text-[9px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.2 rounded-full">
              Step 2 of 3
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Step 1 */}
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white/80 border border-emerald-200/80">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-gray-900">1. Registration Submitted</div>
                  <div className="text-[9px] text-gray-500">Google profile linked ({formattedJoinDate})</div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full shrink-0">
                Done
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-amber-300 shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 ring-2 ring-amber-400/50">
                  <Clock className="w-3 h-3 animate-spin" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-amber-950">2. Super Admin Review</div>
                  <div className="text-[9px] text-amber-900/80">In governance queue for verification</div>
                </div>
              </div>
              <span className="text-[9px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.2 rounded-full shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                In Review
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-gray-50/70 border border-gray-200/60 opacity-60">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
                  <Lock className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-gray-600">3. Portal Access & Dues</div>
                  <div className="text-[9px] text-gray-400">Directory & financial ledgers unlock</div>
                </div>
              </div>
              <span className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded-full shrink-0">
                Auto
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── 4. BOTTOM SECTION: Check Button & Heartbeat ─── */}
      <div className="w-full space-y-2 pt-2">
        <button
          type="button"
          onClick={handleCheckStatus}
          disabled={isRefreshing}
          className="w-full min-h-[46px] px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition duration-150"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Checking Status...' : 'Check Approval Status'}</span>
        </button>
      </div>

    </div>
  );
};

export default PendingVerificationNotice;
