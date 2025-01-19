import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

const AuthenticatedNavbar: React.FC = () => {
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-600'} p-4 shadow-lg transition-colors duration-200`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold hover:text-gray-200 transition-colors">
          AREA
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-white hover:text-gray-200 transition-colors font-medium"
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/profile" 
            className="text-white hover:text-gray-200 transition-colors font-medium"
          >
            {t('nav.profile')}
          </Link>

          {/* Sélecteur de langue */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
            className={`px-2 py-1 rounded ${
              isDarkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="it">IT</option>
            <option value="es">ES</option>
            <option value="zh">ZH</option>
            <option value="ja">JA</option>
          </select>

          <button
            onClick={logout}
            className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-md"
          >
            {t('nav.logout')}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {isDarkMode ? (
              <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AuthenticatedNavbar;