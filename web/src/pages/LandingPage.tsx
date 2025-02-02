import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import LoginNavbar from '../components/LoginNavbar';
import {
  IoFlash,
  IoGitNetwork,
  IoShieldCheckmark,
  IoLogoGithub,
  IoLogoDiscord,
  IoLogoLinkedin,
} from 'react-icons/io5';
import { SiSpotify } from 'react-icons/si';

const LandingPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
        aria-label="Skip to main content"
        tabIndex={0}
      >
        Skip to main
      </a>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
        aria-label="Skip to main content"
        tabIndex={0}
      >
        Skip to main content
      </a>
      <LoginNavbar />
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          {/* Navigation content */}
        </nav>
      </header>
      <div
        className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1
                className={`text-4xl md:text-6xl font-bold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('landing.hero.title')}
              </h1>
              <p
                className={`text-xl md:text-2xl mb-8 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {t('landing.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4" role="group" aria-label="Authentication options">
                <Link to="/signup" aria-label={t('landing.hero.start_button')}>
                  <motion.button
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg
                      font-semibold hover:bg-blue-700 transition-colors"
                    aria-label={t('landing.hero.start_button')}
                    role="button"
                  >
                    {t('landing.hero.start_button')}
                  </motion.button>
                </Link>
                <Link to="/login" aria-label={t('landing.hero.login_button')}>
                  <motion.button
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    className={`w-full sm:w-auto px-8 py-3 rounded-lg font-semibold
                      ${
                        isDarkMode
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      } transition-colors`}
                    aria-label={t('landing.hero.login_button')}
                    role="button"
                  >
                    {t('landing.hero.login_button')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -10 }}
                className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-4">
                  <IoFlash className="w-8 h-8 text-blue-500" />
                  <h2 
                    className={`ml-3 text-xl font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {t('landing.features.automation.title')}
                  </h2>
                </div>
                <p
                  className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {t('landing.features.automation.description')}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-4">
                  <IoGitNetwork className="w-8 h-8 text-green-500" />
                  <h3
                    className={`ml-3 text-xl font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {t('landing.features.services.title')}
                  </h3>
                </div>
                <p
                  className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {t('landing.features.services.description')}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-4">
                  <IoShieldCheckmark className="w-8 h-8 text-purple-500" />
                  <h3
                    className={`ml-3 text-xl font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {t('landing.features.security.title')}
                  </h3>
                </div>
                <p
                  className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {t('landing.features.security.description')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2
                className={`text-3xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('landing.services.title')}
              </h2>
              <p
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {t('landing.services.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: IoLogoGithub, name: 'GitHub', color: 'bg-gray-900' },
                {
                  icon: IoLogoDiscord,
                  name: 'Discord',
                  color: 'bg-indigo-600',
                },
                { icon: SiSpotify, name: 'Spotify', color: 'bg-green-600' },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} 
                    shadow-lg flex items-center space-x-4`}
                >
                  <div className={`p-3 ${service.color} rounded-full`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3
                    className={`text-xl font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {service.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <main id="main-content" role="main" tabIndex={-1}>
        {/* Main content */}
      </main>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </>
  );
};

export default LandingPage;
