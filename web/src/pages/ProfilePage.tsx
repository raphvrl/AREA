import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { AccessibilityFab } from '../components/AccessibilityFab';
import { motion } from 'framer-motion';
import { IoMail, IoLocationSharp, IoPerson, IoCalendar } from 'react-icons/io5';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} pt-20 px-4 pb-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-xl overflow-hidden`}
        >
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            {/* Profile Picture */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className={`absolute -bottom-16 left-8 w-32 h-32 rounded-full border-4 ${
                isDarkMode ? 'border-gray-800 bg-gray-700' : 'border-white bg-gray-200'
              } flex items-center justify-center shadow-lg`}
            >
              <span className="text-5xl font-bold text-gray-600">
                {user?.firstName?.[0]?.toUpperCase()}
              </span>
            </motion.div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('profile.title')}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg
                  hover:bg-blue-700 transition-colors duration-200"
              >
                {t('profile.edit_profile')}
              </motion.button>
            </div>

            {/* Profile Details */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <IoPerson className={`w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{t('profile.firstname')}</p>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{user?.firstName}</p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <IoPerson className={`w-5 h-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{t('profile.lastname')}</p>
                    <p className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{user?.lastName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Services Section */}
            <div className="mt-8">
              <h2 className={`text-xl font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('profile.connected_services')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Discord', 'GitHub'].map((service) => (
                  <motion.div
                    key={service}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    } flex items-center justify-between`}
                  >
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                      {service}
                    </span>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <AccessibilityFab />
    </div>
  );
};

export default ProfilePage;