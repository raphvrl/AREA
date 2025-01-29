import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TranslationProvider } from './context/TranslationContext';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ServicesPage from './pages/ServicesPage';
import AuthenticatedNavbar from './components/AuthenticatedNavbar';
import LoginNavbar from './components/LoginNavbar';
import Footer from './components/Footer';
import { AccessibilityFab } from './components/AccessibilityFab';
import LandingPage from './pages/LandingPage';
import { AccessibilityProvider } from './context/AccessibilityContext';
import APKDownload from './components/APKDownload';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const NavigationBar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return <LoginNavbar />;
  }

  return isAuthenticated ? <AuthenticatedNavbar /> : null;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ) : (
            <LandingPage />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/client.apk"
        element={
          // This component will trigger the download
          <APKDownload />
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <ServicesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TranslationProvider>
          <AccessibilityProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <NavigationBar />
                <main className="flex-grow">
                  <AppRoutes />
                </main>
                <Footer />
                <AccessibilityFab />
              </div>
            </Router>
          </AccessibilityProvider>
        </TranslationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
