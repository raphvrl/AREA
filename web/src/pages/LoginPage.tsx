import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthError, ApiValidationError } from '../types/auth';
import { TranslationKey } from '../translations/types'; // Add this import
import { FaGithub, FaSpotify, FaDropbox, FaTwitch } from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';
import { IconType } from 'react-icons'; // Add this import at the top

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

// Update the OAuthService interface to specify the icon type
interface OAuthService {
  name: string;
  icon: IconType; // Change this from React.ComponentType to IconType
  bgColor: string;
  hoverColor: string;
  path: string;
}

const oauthServices: OAuthService[] = [
  {
    name: 'GitHub',
    icon: FaGithub,
    bgColor: 'bg-gray-800',
    hoverColor: 'hover:bg-gray-900',
    path: '/api/auth/github',
  },
  {
    name: 'Spotify',
    icon: FaSpotify,
    bgColor: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    path: '/api/auth/spotify',
  },
  {
    name: 'Notion',
    icon: SiNotion,
    bgColor: 'bg-black',
    hoverColor: 'hover:bg-gray-900',
    path: '/api/auth/notion',
  },
  {
    name: 'Dropbox',
    icon: FaDropbox,
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    path: '/api/auth/dropbox',
  },
  {
    name: 'Twitch',
    icon: FaTwitch,
    bgColor: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
    path: '/api/auth/twitch',
  },
];

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<AuthError[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const firstName = urlParams.get('firstName');
    const lastName = urlParams.get('lastName');
    const isFirstLogin = urlParams.get('isFirstLogin') === 'true';

    if (firstName && lastName) {
      login({
        firstName: firstName,
        lastName: lastName,
        isFirstLogin: isFirstLogin,
        email: '',
      });
      navigate('/');
    }

    // 🔹 Exécuter handleCallback pour traiter la redirection OAuth
    handleCallback();
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
        `http://localhost:${BACKEND_PORT}/api/signIn`,
        formData
      );

      if (response.data.user) {
        // Store user data in localStorage
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        localStorage.setItem('isAuthenticated', 'true');

        login(response.data.user);
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.response?.data?.errors) {
        const apiErrors = error.response.data as ApiValidationError;
        const mappedErrors =
          apiErrors.errors?.map((err) => {
            const translationKey =
              `login.errors.${err.param}` as TranslationKey;
            return {
              field: err.param,
              message: t(translationKey) || err.msg,
            };
          }) || [];
        setErrors(mappedErrors);
      } else if (error.response?.status === 401) {
        setErrors([
          {
            message: t('login.errors.invalid_credentials'),
          },
        ]);
      } else {
        setErrors([
          {
            message: t('login.errors.general'),
          },
        ]);
      }
    }
  };

  const handleOAuthLogin = (service: OAuthService) => {
    const FRONTEND_PORT = process.env.REACT_APP_FRONTEND_PORT || 8081;
    const redirectUri = `http://localhost:${FRONTEND_PORT}/login`;
    const email = 'jonh.doe@email.com';
    const authUrl = `http://localhost:8080${service.path}?email=${encodeURIComponent(email)}&redirectUri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };
  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('zizi');
    const code = urlParams.get('code');
    const state = urlParams.get('state'); // Le state est une chaîne JSON

    if (code && state) {
      try {
        // Parser le state pour extraire l'URL du service
        const parsedState = JSON.parse(state);
        const serviceUrl = parsedState.service; // Récupérer l'URL du service
        const FRONTEND_PORT = process.env.REACT_APP_FRONTEND_PORT || 8081;
        const redirectUri = `http://localhost:${FRONTEND_PORT}/login`;
        // Envoyer le code et l'email au backend pour finaliser la connexion
        const response = await fetch(
          `http://localhost:${BACKEND_PORT}${serviceUrl}`, // Utiliser l'URL du service
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, redirectUri: redirectUri}),
          }
        );

        // ✅ Correction : Attendre la conversion en JSON
        const data = await response.json();
        console.log(data);
        if (data.user) {
          // Stocker les infos utilisateur
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userData', JSON.stringify(data.user));
          localStorage.setItem('isAuthenticated', 'true');

          login(data.user);
          navigate('/');
        } else {
          console.error('Error handling callback:', data.message);
        }
      } catch (error) {
        console.error('Error handling callback:', error);
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode
          ? 'bg-gray-900'
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      } transition-colors duration-200`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full mx-4 p-8 ${
          isDarkMode
            ? 'bg-gray-900 text-gray-100' // Added text-gray-100 for better contrast
            : 'bg-white'
        } rounded-2xl shadow-2xl space-y-6`}
      >
        <div className="text-center">
          <h2
            className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {t('login.title')}
          </h2>
          <p
            className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
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
              className={`w-full px-4 py-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                  : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder={t('login.password_placeholder')}
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                  : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transform transition-all duration-200 hover:scale-[1.02]"
          >
            login
          </button>
        </form>

        <div className="text-center mt-6">
          <p
            className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {t('login.no_account')}{' '}
            <Link
              to="/signup"
              className={`font-medium ${
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300' // Lighter blue for dark mode
                  : 'text-blue-800 hover:text-blue-700' // Darker blue for light mode
              } transition-colors duration-200`}
            >
              {t('login.create_account')}
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {oauthServices.map((service) => (
              <motion.button
                key={service.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuthLogin(service)}
                className={`w-full p-3 rounded-md flex justify-center items-center gap-2 text-white ${
                  service.name === 'Spotify'
                    ? 'bg-green-700 hover:bg-green-800'
                    : service.bgColor
                } ${service.hoverColor} transition-colors duration-200`}
              >
                <service.icon size={20} />{' '}
                {/* Use size prop instead of className */}
                <span>{service.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
