import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { AccessibilityFab } from '../components/AccessibilityFab';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div 
            className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center"
            role="img" 
            aria-label={t('profile.avatar_description')}
            tabIndex={0}
          >
            <span className="text-4xl" aria-hidden="true">
              {user?.firstName?.[0]?.toUpperCase()}
            </span>
          </div>
          <h1 
            className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            tabIndex={0}
          >
            {user?.firstName} {user?.lastName}
          </h1>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <section 
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            role="region" 
            aria-label={t('profile.info')}
          >
            <h2 
              className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              tabIndex={0}
            >
              {t('profile.info')}
            </h2>
            <div className="space-y-2">
              <dl>
                <div className="grid grid-cols-2 gap-4">
                  <dt 
                    className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    tabIndex={0}
                  >
                    {t('profile.firstname')}:
                  </dt>
                  <dd 
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    tabIndex={0}
                  >
                    {user?.firstName}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <dt 
                    className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    tabIndex={0}
                  >
                    {t('profile.lastname')}:
                  </dt>
                  <dd 
                    className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    tabIndex={0}
                  >
                    {user?.lastName}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </div>
      
      <AccessibilityFab />
    </div>
  );
};

export default ProfilePage;