import React, { useState, useEffect } from 'react';
import { Member } from '../types';

interface UserAvatarProps {
  member?: Partial<Member> | null;
  name?: string;
  photoUrl?: string;
  email?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  alt?: string;
}

export const getEmailAvatarUrl = (email?: string, name?: string): string => {
  if (email && email.includes('@')) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || email.split('@')[0] || 'Member').trim();
    const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=4f46e5&color=ffffff&bold=true&size=128`;
    return `https://unavatar.io/${encodeURIComponent(cleanEmail)}?fallback=${encodeURIComponent(fallback)}`;
  }
  const cleanName = (name || 'Member').trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=4f46e5&color=ffffff&bold=true&size=128`;
};

export const getFallbackAvatarUrl = (name: string, email?: string): string => {
  return getEmailAvatarUrl(email, name);
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  member,
  name: propName,
  photoUrl: propPhotoUrl,
  email: propEmail,
  className = '',
  size = 'md',
  alt
}) => {
  const name = propName || member?.name || 'Member';
  const email = (propEmail || member?.email || '').trim().toLowerCase();
  const rawPhoto = propPhotoUrl || member?.photoUrl || '';

  // Determine candidate sources in order of preference:
  // 1. Explicit photoUrl if valid and not a ui-avatars link
  // 2. Email-based unavatar (Google / Gravatar / Domain)
  // 3. Initials fallback
  const getInitialCandidates = (): string[] => {
    const list: string[] = [];
    if (rawPhoto && rawPhoto.trim() && !rawPhoto.includes('ui-avatars.com')) {
      list.push(rawPhoto.trim());
    }
    if (email && email.includes('@')) {
      list.push(`https://unavatar.io/${encodeURIComponent(email)}`);
    }
    const cleanName = (name || email.split('@')[0] || 'Member').trim();
    list.push(`https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=4f46e5&color=ffffff&bold=true&size=128`);
    return list;
  };

  const [candidates, setCandidates] = useState<string[]>(getInitialCandidates());
  const [candidateIndex, setCandidateIndex] = useState(0);

  // Reset when props change
  useEffect(() => {
    setCandidates(getInitialCandidates());
    setCandidateIndex(0);
  }, [rawPhoto, email, name]);

  const handleImgError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    }
  };

  const effectiveSrc = candidates[candidateIndex] || getInitialCandidates()[0];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  }[size];

  return (
    <img
      src={effectiveSrc}
      alt={alt || name}
      onError={handleImgError}
      className={`rounded-full object-cover shrink-0 ${sizeClasses} ${className}`}
      loading="lazy"
    />
  );
};

export default UserAvatar;

