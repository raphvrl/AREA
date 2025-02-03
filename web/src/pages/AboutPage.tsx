import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

const AboutPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8 transition-colors duration-200`}
    >
      <div
        className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}
      >
        <h1
          className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          {t('about.title')}
        </h1>
        <p
          className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {t('about.description')}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
