import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { useAuth } from './hooks/useAuth';

// Lazy-loaded pages for optimized bundle size & fast loading
const PublicPortalPage = lazy(() => import('./pages/PublicPortalPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Sleek Branded Loading Spinner Fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md animate-pulse ring-2 ring-indigo-400/30">
        <span className="bg-gradient-to-tr from-indigo-300 via-sky-300 to-white bg-clip-text text-transparent">CS</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
      </div>
    </div>
  </div>
);

// Member Protected Route: Only opens main page when user is authenticated
const MemberProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// App content wrapper with active Firebase Firestore sync
const AppRoutes: React.FC = () => {
  useFirebaseSync();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Member Authentication Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Club Member Portal: Only accessible when authenticated */}
        <Route
          path="/"
          element={
            <MemberProtectedRoute>
              <PublicPortalPage />
            </MemberProtectedRoute>
          }
        />
        <Route
          path="/directory"
          element={
            <MemberProtectedRoute>
              <PublicPortalPage />
            </MemberProtectedRoute>
          }
        />
        <Route
          path="/dues"
          element={
            <MemberProtectedRoute>
              <PublicPortalPage />
            </MemberProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <MemberProtectedRoute>
              <PublicPortalPage />
            </MemberProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <MemberProtectedRoute>
              <PublicPortalPage />
            </MemberProtectedRoute>
          }
        />

        {/* Dedicated Admin Portal Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/" element={<AdminDashboardPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
