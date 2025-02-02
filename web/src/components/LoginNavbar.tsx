import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import {
  IoHome,
  IoLanguage,
  IoSunny,
  IoMoon,
} from 'react-icons/io5';

const LoginNavbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);

  // Theme toggle button accessibility
  const themeButtonLabel = isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full top-0 z-50 ${
        isDarkMode
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800'
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      } transition-all duration-200`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div
                className={`text-3xl font-black bg-gradient-to-r ${
                  isDarkMode
                    ? 'from-blue-400 to-purple-500'
                    : 'from-blue-500 to-purple-600'
                } text-transparent bg-clip-text`}
              >
                AREA
              </div>
            </motion.div>
          </Link>

          {/* Controls */}
          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center space-x-2 ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label={`Change language. Current language: ${language}`}
                aria-expanded={isLangMenuOpen}
              >
                <IoLanguage className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium hidden md:block">
                  {language.toUpperCase()}
                </span>
              </motion.button>

              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute right-0 mt-2 py-2 w-48 rounded-lg shadow-xl ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  {['fr', 'en', 'de', 'es', 'it', 'zh', 'ja'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang as any);
                        setIsLangMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
              aria-label={themeButtonLabel}
            >
              {isDarkMode ? (
                <IoSunny className="w-5 h-5" aria-hidden="true" />
              ) : (
                <IoMoon className="w-5 h-5" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default LoginNavbar;
