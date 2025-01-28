import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthError, ApiValidationError } from '../types/auth';
import { TranslationKey } from '../translations/types'; // Add this import

const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

interface LoginResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isFirstLogin: boolean;
    [key: string]: any;
  };
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<AuthError[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const firstName = urlParams.get('firstName');
    const lastName = urlParams.get('lastName');
    const isFirstLogin = urlParams.get('isFirstLogin') === 'true';
    const spotifyToken = urlParams.get('spotify_token');
    const discordToken = urlParams.get('discord_token');
    const githubToken = urlParams.get('github_token');

    const handleSocialLogin = (token: string, platform: string, userData: any) => {
      const user = {
        ...userData,
        email: userData.email || `${platform}_user@area.com`
      };
      
      // Store authentication data
      localStorage.setItem(`${platform}_token`, token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userPlatform', platform);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Log the user in
      login(user);
      
      // Navigate to services page instead of login
      navigate('/services');
    };

    if (githubToken && firstName && lastName) {
      handleSocialLogin(githubToken, 'github', {
        firstName,
        lastName,
        isFirstLogin: true,
        email: '' // Add empty string as default
      });
    } else if (discordToken && firstName && lastName) {
      handleSocialLogin(discordToken, 'discord', {
        firstName,
        lastName,
        isFirstLogin: true,
        email: '' // Add empty string as default
      });
    } else if (spotifyToken) {
      handleSocialLogin(spotifyToken, 'spotify', {
        firstName: 'Spotify',
        lastName: 'User',
        isFirstLogin: true,
        email: '' // Add empty string as default
      });
    } else if (firstName && lastName) {
      login({ 
        firstName, 
        lastName, 
        isFirstLogin,
        email: '' // Add empty string as default
      });
      navigate('/');
    }
  }, [login, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    try {
      const response = await axios.post<LoginResponse>(
        `http://localhost:${BACKEND_PORT}/api/sign_in`, 
        formData
      );
  
      if (response.data.user) {
        // Store email in localStorage before login
        localStorage.setItem('userEmail', formData.email);
        login(response.data.user);
        navigate('/');
      }
  
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data as ApiValidationError;
        const mappedErrors = apiErrors.errors?.map(err => {
          const translationKey = `login.errors.${err.param}` as TranslationKey;
          return {
            field: err.param,
            message: t(translationKey) || err.msg
          };
        }) || [];
        setErrors(mappedErrors);
      } else if (error.response?.status === 401) {
        setErrors([{
          message: t('login.errors.invalid_credentials')
        }]);
      } else {
        setErrors([{
          message: t('login.errors.general')
        }]);
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } transition-colors duration-200`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full mx-4 p-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-2xl shadow-2xl space-y-6`}
      >
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('login.title')}
          </h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.welcome_back')}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          {errors.length > 0 && (
            <div className="text-red-500 text-sm text-center">
              {errors.map((error, index) => (
                <p key={index}>{error.message}</p>
              ))}
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder={t('login.email')}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder={t('login.password_placeholder')}
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transform transition-all duration-200 hover:scale-[1.02]"
          >
            {t('login.sign_in')}
          </button>
        </form>

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

        <div className="space-y-3">
          {/* Social login buttons with hover effects and icons */}
          <motion.a
            whileHover={{ scale: 1.02 }}
            href={`http://localhost:${BACKEND_PORT}/api/auth/linkedin`}
            className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-[#0077B5] hover:bg-[#006699] text-white transition-colors duration-200"
          >
            <i className="fab fa-linkedin mr-2"></i>
            {t('login.with_linkedin')}
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            href={`http://localhost:${BACKEND_PORT}/api/auth/spotify`}
            className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
          >
            <i className="fab fa-spotify mr-2"></i>
            {t('login.with_spotify')}
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            href={`http://localhost:${BACKEND_PORT}/api/auth/discord`}
            className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-[#7289DA] hover:bg-[#6A7EC5] text-white transition-colors duration-200"
          >
            <i className="fab fa-discord mr-2"></i>
            {t('login.with_discord')}
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            href={`http://localhost:${BACKEND_PORT}/api/auth/github`}
            className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200"
          >
            <i className="fab fa-github mr-2"></i>
            {t('login.with_github')}
          </motion.a>
        </div>

        <div className="text-center mt-6">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.no_account')}{' '}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              {t('login.create_account')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
