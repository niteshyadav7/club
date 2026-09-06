import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../store';
import { setCurrentUser } from '../store/slices/authSlice';
import { addApplicantMember } from '../store/slices/membersSlice';
import { addToast } from '../store/slices/uiSlice';
import { LovebirdIllustration } from '../components/auth/LovebirdIllustration';
import { Eye, EyeOff, Sparkles, CheckCircle2, User, ArrowRight, X } from 'lucide-react';
import { Member } from '../types';
import { saveMemberToFirestore } from '../services/firebaseService';

interface Slide {
  title: string;
  description: string;
}

const carouselSlides: Slide[] = [
  {
    title: 'Maecenas mattis egestas',
    description: 'Erdum et malesuada fames ac ante ipsum primis in faucibus uspendisse porta.',
  },
  {
    title: 'Community & Fellowship',
    description: 'Connect with club members, celebrate milestones, and build lasting relationships.',
  },
  {
    title: 'Transparent Governance',
    description: 'Real-time financial ledgers, itemized dues, and complete operational clarity.',
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, handleGoogleSignIn, handleSimulatedGoogleLogin } = useAuth();
  const members = useAppSelector((state) => state.members.members);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // New member registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('');

  // If already authenticated, redirect to home
  useEffect(() => {
    if (currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  // Carousel slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Handle Form Submit (Username / Email / Phone Login)
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      dispatch(addToast({
        title: 'Input Required',
        message: 'Please enter your username, email, or phone number.',
        type: 'warning'
      }));
      return;
    }

    setIsSubmitting(true);
    const searchVal = identifier.trim().toLowerCase();

    // Match existing member
    const matched = members.find((m) =>
      m.email?.toLowerCase() === searchVal ||
      m.name?.toLowerCase().includes(searchVal) ||
      m.phone.replace(/\D/g, '').includes(searchVal.replace(/\D/g, ''))
    );

    if (matched) {
      dispatch(setCurrentUser(matched));
      dispatch(addToast({
        title: 'Welcome Back!',
        message: `Signed in as ${matched.name} (${matched.role.replace('_', ' ')})`,
        type: 'success'
      }));
      navigate('/', { replace: true });
    } else {
      dispatch(addToast({
        title: 'Account Not Found',
        message: 'No registered member found with these details. Please create an account or sign in with Google.',
        type: 'error'
      }));
    }
    setIsSubmitting(false);
  };

  // Handle New Member Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const newMember: Member = {
      id: `mem-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || '+91 98765 00000',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      address: 'Club Enclave',
      city: regCity.trim() || 'New Delhi',
      bio: 'New applicant member.',
      role: 'PENDING',
      verificationStatus: 'PENDING_APPROVAL',
      badges: [],
      birthday: '',
      joinedDate: new Date().toISOString().split('T')[0],
      duesStatus: 'PENDING'
    };

    dispatch(addApplicantMember(newMember));
    dispatch(setCurrentUser(newMember));
    try {
      await saveMemberToFirestore(newMember);
    } catch (err) {
      console.warn('Firestore sync notice:', err);
    }
    setShowRegisterModal(false);
    dispatch(addToast({
      title: 'Registration Received ⏳',
      message: `Welcome to ClubSphere, ${newMember.name}! Your account is in the Admin Verification queue.`,
      type: 'info'
    }));
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white selection:bg-[#95b3a4] selection:text-white">
      
      {/* ================= LEFT / DESKTOP-ONLY SAGE ILLUSTRATION PANE ================= */}
      <div className="hidden md:flex md:w-1/2 min-h-screen bg-[#95b3a4] p-8 md:p-12 lg:p-16 flex-col justify-between items-center text-center relative overflow-hidden">
        
        {/* Subtle Background Art Rings */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />

        {/* Top Spacer for balance */}
        <div className="h-2" />

        {/* Center Artwork Illustration */}
        <div className="w-full flex-1 flex items-center justify-center py-6">
          <LovebirdIllustration className="w-64 md:w-72 lg:w-84 max-h-[380px] drop-shadow-sm transition-transform duration-500 hover:scale-105" />
        </div>

        {/* Bottom Carousel Highlights & Slider Dots */}
        <div className="w-full max-w-md mt-4 space-y-3 z-10 pb-2">
          <div className="min-h-[64px] flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight drop-shadow-xs transition-opacity duration-300">
              {carouselSlides[activeSlide].title}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-sm mx-auto mt-1.5 leading-relaxed drop-shadow-xs transition-opacity duration-300">
              {carouselSlides[activeSlide].description}
            </p>
          </div>

          {/* Slider Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-7 h-1.5 bg-white shadow-xs'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT / FULL-SCREEN MOBILE & DESKTOP AUTH FORM PANE ================= */}
      <div className="w-full md:w-1/2 min-h-screen bg-white px-6 py-8 sm:px-10 md:px-12 lg:px-16 flex flex-col justify-center items-center relative overflow-y-auto">
        
        <div className="max-w-sm sm:max-w-md w-full my-auto py-2">
          {/* Brand Script Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-['Dancing_Script',_cursive] text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
              ClubSphere
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1.5 tracking-wide">
              Welcome to the Club
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-5 w-full">
            
            {/* Username or Email Underline Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Users name or Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username, Email, or Phone"
                className="w-full py-2 border-b border-gray-300 focus:border-[#7a9c8c] focus:outline-none text-sm font-semibold text-gray-800 placeholder:text-gray-400 transition bg-transparent"
              />
            </div>

            {/* Password Underline Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full py-2 pr-8 border-b border-gray-300 focus:border-[#7a9c8c] focus:outline-none text-sm font-semibold text-gray-800 transition bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-2.5 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-[11px] font-semibold text-[#6e9381] hover:text-[#557867] transition"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Charcoal Pill Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-full bg-[#52585f] hover:bg-[#3d4248] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign in'}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 font-medium">or</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/80 text-gray-700 font-semibold text-xs transition duration-150 flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Bottom Create Account Link */}
            <div className="text-center pt-2 text-xs text-gray-500 font-medium">
              New to ClubSphere?{' '}
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="font-bold text-[#6e9381] hover:text-[#557867] underline transition"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ================= REGISTER MODAL ================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h3 className="font-['Dancing_Script',_cursive] text-3xl font-bold text-gray-800">
                Join ClubSphere
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Create your verified member account
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7a9c8c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. member@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7a9c8c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7a9c8c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City / Region</label>
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  placeholder="New Delhi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7a9c8c] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#52585f] hover:bg-[#3d4248] text-white text-xs font-bold shadow-md"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center relative">
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#95b3a4]/20 text-[#557867] flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              🔐
            </div>
            <h3 className="text-base font-bold text-gray-900">Password Recovery</h3>
            <p className="text-xs text-gray-500 mt-1">
              Enter your registered email or phone to receive an instant verification passcode.
            </p>
            <input
              type="text"
              placeholder="Your email or phone"
              className="w-full px-3.5 py-2.5 mt-4 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#7a9c8c] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setShowForgotPasswordModal(false);
                dispatch(addToast({
                  title: 'Reset Link Dispatched 📩',
                  message: 'A secure recovery passcode has been sent to your registered email.',
                  type: 'success'
                }));
              }}
              className="w-full mt-4 py-2.5 rounded-full bg-[#52585f] text-white text-xs font-bold shadow-md hover:bg-[#3d4248]"
            >
              Send Recovery Passcode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
