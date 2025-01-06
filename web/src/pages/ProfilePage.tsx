import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8 transition-colors duration-200`}>
      <div className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
        <div className="text-center mb-8">
          <div className={`w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4`}>
            <span className="text-white text-3xl font-bold">
              {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
            </span>
          </div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {user?.firstName} {user?.lastName}
          </h1>
        </div>

        <div className="space-y-6">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h2 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('profile.info')}
            </h2>
            <div className="space-y-2">
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">{t('profile.firstname')}:</span> {user?.firstName}
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">{t('profile.lastname')}:</span> {user?.lastName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;