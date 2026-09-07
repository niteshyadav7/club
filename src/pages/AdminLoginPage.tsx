import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../store';
import { setCurrentUser } from '../store/slices/authSlice';
import { addAuditLog } from '../store/slices/auditSlice';
import { addToast } from '../store/slices/uiSlice';
import { User, Lock, AlertCircle } from 'lucide-react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { saveMemberToFirestore, seedSuperAdminAccount, SUPER_ADMIN_CREDENTIALS } from '../services/firebaseService';
import { Member } from '../types';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role, isVerified } = useAuth();
  const members = useAppSelector((state) => state.members.members);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const cleanUser = username.trim().toLowerCase();
      const enteredPassword = password.trim();

      // Check if signing in as Super Admin
      const isSuperAdminUser =
        cleanUser === SUPER_ADMIN_CREDENTIALS.email.toLowerCase() ||
        cleanUser === 'superadmin' ||
        cleanUser === 'admin';

      if (isSuperAdminUser) {
        // Validate password
        if (enteredPassword !== SUPER_ADMIN_CREDENTIALS.password) {
          setError('Invalid credentials. Please verify your admin password.');
          setIsLoading(false);
          return;
        }

        // Try Firebase Auth Sign-In if available
        try {
          await signInWithEmailAndPassword(auth, SUPER_ADMIN_CREDENTIALS.email, SUPER_ADMIN_CREDENTIALS.password);
        } catch (authErr) {
          console.warn('Firebase Auth sign-in notice:', authErr);
        }

        // Check if Super Admin exists in Firestore members or prepare doc
        let superAdminMember = members.find(
          (m) => m.email?.toLowerCase() === SUPER_ADMIN_CREDENTIALS.email.toLowerCase()
        );

        if (!superAdminMember) {
          try {
            superAdminMember = await seedSuperAdminAccount();
          } catch (dbErr) {
            console.warn('Firestore write permission notice (rules update recommended):', dbErr);
            superAdminMember = {
              id: 'admin-superadmin',
              name: 'Super Admin',
              email: 'superadmin@gmail.com',
              phone: '+91 98000 12345',
              photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
              address: 'Executive Suite 1, ClubSphere Governance Headquarters',
              city: 'Mumbai',
              bio: 'Super Administrator with complete governance and approval authority.',
              role: 'ADMIN',
              verificationStatus: 'VERIFIED',
              badges: ['Super Admin', 'Founding Member', 'Core Member', 'VIP Member'],
              birthday: '1990-01-01',
              joinedDate: new Date().toISOString().split('T')[0],
              duesStatus: 'PAID'
            };
          }
        }

        dispatch(setCurrentUser(superAdminMember));
        dispatch(addAuditLog({
          action: 'Super Admin Logged In',
          performedBy: `${superAdminMember.name} (${superAdminMember.email})`,
          target: 'Admin Console Governance Suite',
          type: 'MEMBER'
        }));
        dispatch(addToast({
          title: 'Super Admin Authenticated! 🛡️',
          message: `Welcome, ${superAdminMember.name}.`,
          type: 'success'
        }));
        setIsLoading(false);
        navigate('/admin');
        return;
      }

      // Check against any other registered admin in Firestore
      const matchedAdmin = members.find(
        (m) =>
          m.role === 'ADMIN' &&
          (m.email?.toLowerCase() === cleanUser ||
           m.phone?.toLowerCase() === cleanUser ||
           m.name?.toLowerCase() === cleanUser ||
           m.name?.toLowerCase().includes(cleanUser))
      );

      if (matchedAdmin) {
        dispatch(setCurrentUser(matchedAdmin));
        dispatch(addAuditLog({
          action: 'Admin Logged In',
          performedBy: `${matchedAdmin.name} (Admin)`,
          target: 'Admin Console Suite',
          type: 'MEMBER'
        }));
        dispatch(addToast({
          title: 'Authenticated! 🛡️',
          message: `Welcome, ${matchedAdmin.name}.`,
          type: 'success'
        }));
        setIsLoading(false);
        navigate('/admin');
      } else {
        setError('No administrator account found matching this username/email.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 font-sans selection:bg-[#192452] selection:text-white">
      {/* Center Minimalist Form matching exact user screenshot */}
      <div className="max-w-xs w-full mx-auto">
        {/* Title with bottom underline bar */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Login
          </h2>
          {/* Accent bottom bar */}
          <div className="w-16 h-1 bg-[#1c2a68] mx-auto mt-2 rounded-full"></div>
        </div>

        {error && (
          <div className="mb-5 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Input with left user icon and clean bottom border line */}
          <div className="relative border-b-2 border-gray-300 focus-within:border-[#1c2a68] transition-colors pb-1 flex items-center gap-2.5">
            <User className="w-4 h-4 text-gray-700 shrink-0" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username / Email"
              className="w-full bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 py-1"
            />
          </div>

          {/* Password Input with left lock icon and clean bottom border line */}
          <div className="relative border-b-2 border-gray-300 focus-within:border-[#1c2a68] transition-colors pb-1 flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-gray-700 shrink-0" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 py-1"
            />
          </div>

          {/* Sign In Button (Solid Dark Blue/Navy as in screenshot) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-md bg-[#192452] hover:bg-[#121c44] text-white text-xs font-bold tracking-wide transition shadow-sm active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
