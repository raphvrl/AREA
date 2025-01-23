// src/components/LoginNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { IoLanguage, IoMoon, IoSunny } from 'react-icons/io5';

const LoginNavbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage } = useTranslation();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full top-0 z-50 ${
        isDarkMode 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      } transition-all duration-200`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/login">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className={`text-3xl font-black bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-blue-400 to-purple-500' 
                  : 'from-blue-500 to-purple-600'
              } text-transparent bg-clip-text`}>
                AREA
              </div>
            </motion.div>
          </Link>

          {/* Controls */}
          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            <div className="relative group">
              <div className="flex items-center space-x-2 cursor-pointer">
                <IoLanguage className={`w-5 h-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                  className={`appearance-none cursor-pointer font-medium ${
                    isDarkMode 
                      ? 'bg-gray-900 text-gray-300' 
                      : 'bg-white text-gray-700'
                  } focus:outline-none`}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="es">Español</option>
                </select>
              </div>
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
              } transition-colors duration-200`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <IoSunny className="w-5 h-5" />
              ) : (
                <IoMoon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default LoginNavbar;