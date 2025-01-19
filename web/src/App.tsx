import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TranslationProvider } from './context/TranslationContext';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AuthenticatedNavbar from './components/AuthenticatedNavbar';
import LoginNavbar from './components/LoginNavbar';
import Footer from './components/Footer';
import { AccessibilityFab } from './components/AccessibilityFab';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const NavigationBar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === '/login') {
    return <LoginNavbar />;
  }

  return isAuthenticated ? <AuthenticatedNavbar /> : null;
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <AccessibilityFab />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TranslationProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <NavigationBar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
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
                </Routes>
              </main>
              <Footer />
              <AccessibilityFab />
            </div>
          </Router>
        </TranslationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
