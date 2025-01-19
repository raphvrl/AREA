import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const firstName = urlParams.get('firstName');
    const lastName = urlParams.get('lastName');
    const isFirstLogin = urlParams.get('isFirstLogin') === 'true';
    const spotifyToken = urlParams.get('spotify_token');
    const discordToken = urlParams.get('discord_token');
    const githubToken = urlParams.get('github_token');
    
    if (githubToken && firstName && lastName) {
      localStorage.setItem('github_token', githubToken);
      const githubUser = {
        firstName: firstName,
        lastName: lastName,
        isFirstLogin: true
      };
      localStorage.setItem('user', JSON.stringify(githubUser));
      login(githubUser);
      navigate('/');
      return;
    }
    
    if (discordToken && firstName && lastName) {
      localStorage.setItem('discord_token', discordToken);
      const discordUser = {
        firstName: firstName,
        lastName: lastName,
        isFirstLogin: true
      };
      localStorage.setItem('user', JSON.stringify(discordUser));
      login(discordUser);
      navigate('/');
      return;
    }

    if (spotifyToken) {
      localStorage.setItem('spotify_token', spotifyToken);
      const spotifyUser = {
        firstName: 'Spotify',
        lastName: 'User',
        isFirstLogin: true
      };
      localStorage.setItem('user', JSON.stringify(spotifyUser));
      login(spotifyUser);
      navigate('/');
      return;
    }

    if (firstName && lastName) {
      const user = {
        firstName: firstName,
        lastName: lastName,
        isFirstLogin: isFirstLogin || false
      };
      login(user);
      navigate('/');
    }
  }, [navigate, login]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`max-w-md w-full space-y-8 p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('login.title')}
          </h2>
        </div>
        <div className="space-y-4">
          <a
            href={`https://localhost:${BACKEND_PORT}/api/auth/linkedin`}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center"
          >
            {t('login.with_linkedin')}
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                {t('login.or')}
              </span>
            </div>
          </div>

          <a
            href={`https://localhost:${BACKEND_PORT}/api/auth/spotify`}
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded text-center"
          >
            {t('login.with_spotify')}
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                {t('login.or')}
              </span>
            </div>
          </div>

          <a
            href={`https://localhost:${BACKEND_PORT}/api/auth/discord`}
            className="block w-full bg-[#7289DA] hover:bg-[#6A7EC5] text-white font-bold py-3 px-4 rounded text-center"
          >
            {t('login.with_discord')}
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                {t('login.or')}
              </span>
            </div>
          </div>

          <a
            href={`https://localhost:${BACKEND_PORT}/api/auth/github`}
            className="block w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded text-center"
          >
            {t('login.with_github')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;