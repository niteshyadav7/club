import { useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useAppDispatch, useAppSelector } from '../store';
import { sendWish, dismissBanner } from '../store/slices/celebrationsSlice';
import { addToast } from '../store/slices/uiSlice';
import { Member } from '../types';

export function useCelebrations() {
  const dispatch = useAppDispatch();
  const members = useAppSelector((state) => state.members.members);
  const wishes = useAppSelector((state) => state.celebrations.wishes);
  const isBannerDismissed = useAppSelector((state) => state.celebrations.isBannerDismissed);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // Check today's date formatted as MM-DD
  const today = new Date();
  const currentMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const todayCelebrations = useMemo(() => {
    const list: { member: Member; type: 'BIRTHDAY' | 'ANNIVERSARY'; years?: number }[] = [];

    members.forEach((member) => {
      if (member.verificationStatus !== 'VERIFIED') return;
      if (member.role === 'ADMIN' || member.email?.toLowerCase().trim() === 'superadmin@gmail.com') return;

      // Check birthday
      if (member.birthday) {
        const [, m, d] = member.birthday.split('-');
        if (`${m}-${d}` === currentMonthDay) {
          list.push({ member, type: 'BIRTHDAY' });
        }
      }

      // Check anniversary
      if (member.anniversary) {
        const [y, m, d] = member.anniversary.split('-');
        if (`${m}-${d}` === currentMonthDay) {
          const years = today.getFullYear() - parseInt(y, 10);
          list.push({ member, type: 'ANNIVERSARY', years });
        }
      }
    });

    return list;
  }, [members, currentMonthDay]);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0D5C3A', '#22C55E', '#EAB308', '#E8F5E9', '#38BDF8'],
    });
  }, []);

  const handleSendWish = useCallback((
    targetMember: Member,
    type: 'BIRTHDAY' | 'ANNIVERSARY',
    customMessage?: string
  ) => {
    triggerConfetti();

    const senderName = currentUser?.name || 'Club Member';
    const senderPhoto = currentUser?.photoUrl;

    const defaultMsg = type === 'BIRTHDAY'
      ? `🎉 Wishing ${targetMember.name} a wonderful Birthday filled with joy and success! 🎂⛳`
      : `💐 Happy Wedding Anniversary ${targetMember.name}! Wishing you endless happiness! 🥂✨`;

    const message = customMessage || defaultMsg;

    dispatch(sendWish({
      memberId: targetMember.id,
      memberName: targetMember.name,
      type,
      wishedBy: senderName,
      wishedByPhoto: senderPhoto,
      message,
    }));

    dispatch(addToast({
      title: 'Wishes Sent! 🎉',
      message: `Your greeting was sent to ${targetMember.name} and posted to the celebration feed.`,
      type: 'success',
    }));
  }, [currentUser, dispatch, triggerConfetti]);

  const handleDismissBanner = useCallback(() => {
    dispatch(dismissBanner());
  }, [dispatch]);

  return {
    todayCelebrations,
    wishes,
    isBannerDismissed,
    triggerConfetti,
    handleSendWish,
    handleDismissBanner,
  };
}
