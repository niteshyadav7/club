import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicPortalPage } from './pages/PublicPortalPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { LoginPage } from './pages/LoginPage';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { useAuth } from './hooks/useAuth';

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
