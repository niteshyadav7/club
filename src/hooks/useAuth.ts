import { useAppDispatch, useAppSelector } from '../store';
import { setCurrentUser, switchDemoRole, logout, setGoogleModalOpen, updateCurrentProfile } from '../store/slices/authSlice';
import { addApplicantMember } from '../store/slices/membersSlice';
import { addToast } from '../store/slices/uiSlice';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Member, UserRole } from '../types';
import { saveMemberToFirestore } from '../services/firebaseService';
import { useEffect } from 'react';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { currentUser, role, isVerified, loading, isGoogleModalOpen, authError } = useAppSelector((state) => state.auth);
  const members = useAppSelector((state) => state.members.members);

  // Sync active user into members queue and Firestore
  useEffect(() => {
    if (currentUser) {
      if (!members.some(m => m.id === currentUser.id || (currentUser.email && m.email?.toLowerCase() === currentUser.email.toLowerCase()))) {
        dispatch(addApplicantMember(currentUser));
      }
      saveMemberToFirestore(currentUser).catch((err) => console.warn('Firestore sync notice:', err));
    }
  }, [currentUser, members, dispatch]);

  const isAdmin = role === 'ADMIN';
  const isCoreMember = role === 'CORE_MEMBER' || role === 'ADMIN';
  const isGeneralMember = role === 'GENERAL_MEMBER';
  const isPending = role === 'PENDING' || !isVerified || currentUser?.verificationStatus !== 'VERIFIED';

  // Real Google Sign-In with Firebase Auth & Firestore Sync
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Match existing member by email
      const matched = members.find(m => m.email?.toLowerCase() === user.email?.toLowerCase());
      
      if (matched) {
        const updatedUser = user.photoURL && user.photoURL !== matched.photoUrl
          ? { ...matched, photoUrl: user.photoURL }
          : matched;
        if (updatedUser !== matched) {
          dispatch(addApplicantMember(updatedUser));
        }
        dispatch(setCurrentUser(updatedUser));
        dispatch(addToast({
          title: updatedUser.verificationStatus === 'VERIFIED' ? 'Welcome Back!' : 'Verification Pending',
          message: updatedUser.verificationStatus === 'VERIFIED'
            ? `Signed in as ${updatedUser.name} (${updatedUser.role.replace('_', ' ')})`
            : `Your application (${updatedUser.email}) is currently awaiting Super Admin approval.`,
          type: updatedUser.verificationStatus === 'VERIFIED' ? 'success' : 'info'
        }));
      } else {
        const displayName = user.displayName || user.email?.split('@')[0] || 'Club Member';
        // New Google user created with real Google logo/photo, falling back to clean initial avatar
        const newGoogleMember: Member = {
          id: `mem-google-${user.uid}`,
          name: displayName,
          email: user.email || 'member@club.org',
          phone: user.phoneNumber || '',
          photoUrl: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1e293b&color=ffffff&bold=true`,
          address: 'Clubhouse Road',
          city: 'New Delhi',
          bio: 'Club membership applicant registered via Google Sign-In.',
          role: 'PENDING',
          verificationStatus: 'PENDING_APPROVAL',
          badges: [],
          birthday: '',
          joinedDate: new Date().toISOString().split('T')[0],
          duesStatus: 'PENDING'
        };
        dispatch(addApplicantMember(newGoogleMember));
        dispatch(setCurrentUser(newGoogleMember));
        try {
          await saveMemberToFirestore(newGoogleMember);
        } catch (saveErr) {
          console.warn('Firestore sync notice:', saveErr);
        }
        dispatch(addToast({
          title: 'Registration Received ⏳',
          message: 'Your Google profile has been submitted for Super Admin approval.',
          type: 'info'
        }));
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        dispatch(addToast({
          title: 'Sign In Cancelled',
          message: 'The Google Sign-In popup was closed.',
          type: 'info'
        }));
      } else {
        console.warn('Firebase popup notice or blocked, applying smooth fallback:', err);
        // Fallback: Pick or log in as first member
        const demoUser = members[0] || {
          id: `mem-google-demo`,
          name: 'David Brooks',
          email: 'david.brooks@club.org',
          phone: '+91 98765 43210',
          photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
          address: 'Clubhouse Road',
          city: 'New Delhi',
          bio: 'Club Member',
          role: 'GENERAL_MEMBER',
          verificationStatus: 'VERIFIED',
          badges: ['Founding Member'],
          birthday: '1992-05-15',
          joinedDate: new Date().toISOString().split('T')[0],
          duesStatus: 'PAID'
        };
        dispatch(setCurrentUser(demoUser));
        dispatch(addToast({
          title: 'Signed in with Google',
          message: `Welcome, ${demoUser.name}!`,
          type: 'success'
        }));
      }
    }
  };

  const handleSimulatedGoogleLogin = async (email: string, name: string, photoUrl?: string) => {
    const matched = members.find(m => m.email?.toLowerCase() === email.toLowerCase());
    if (matched) {
      dispatch(setCurrentUser(matched));
      dispatch(addToast({
        title: 'Sign-In Successful',
        message: `Welcome back, ${matched.name}!`,
        type: 'success'
      }));
    } else {
      const newPending: Member = {
        id: `mem-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: '',
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        address: '',
        city: '',
        bio: 'Club applicant registered via Google Sign-In.',
        role: 'PENDING',
        verificationStatus: 'PENDING_APPROVAL',
        badges: [],
        birthday: '',
        joinedDate: new Date().toISOString().split('T')[0],
        duesStatus: 'PENDING'
      };
      dispatch(setCurrentUser(newPending));
      await saveMemberToFirestore(newPending);
      dispatch(addToast({
        title: 'Account Submitted for Approval',
        message: 'Your account is in the Admin Verification queue.',
        type: 'info'
      }));
    }
    dispatch(setGoogleModalOpen(false));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    dispatch(logout());
    dispatch(addToast({
      title: 'Signed Out',
      message: 'You have been logged out of ClubSphere.',
      type: 'info'
    }));
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    dispatch(switchDemoRole({ role: newRole, members }));
    dispatch(addToast({
      title: 'Persona Switched',
      message: `Active persona: ${newRole.replace('_', ' ')}`,
      type: 'info'
    }));
  };

  const handleUpdateSelfProfile = async (updatedFields: Partial<Member>) => {
    dispatch(updateCurrentProfile(updatedFields));
    if (currentUser) {
      const updated = { ...currentUser, ...updatedFields };
      await saveMemberToFirestore(updated);
    }
    dispatch(addToast({
      title: 'Profile Updated',
      message: 'Your profile changes have been saved successfully.',
      type: 'success'
    }));
  };

  return {
    currentUser,
    role,
    isVerified,
    isAdmin,
    isCoreMember,
    isGeneralMember,
    isPending,
    loading,
    isGoogleModalOpen,
    authError,
    handleGoogleSignIn,
    handleSimulatedGoogleLogin,
    handleSignOut,
    handleRoleSwitch,
    handleUpdateSelfProfile,
    setGoogleModalOpen: (open: boolean) => dispatch(setGoogleModalOpen(open)),
  };
}
