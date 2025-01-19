import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import axios from 'axios';

const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

interface LoginResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
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
    identifier: '',
    password: '',
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const firstName = urlParams.get('firstName');
    const lastName = urlParams.get('lastName');
    const isFirstLogin = urlParams.get('isFirstLogin') === 'true';
    const spotifyToken = urlParams.get('spotify_token');
    const discordToken = urlParams.get('discord_token');
    const githubToken = urlParams.get('github_token');

    const handleSocialLogin = (token: string, platform: string, userData: any) => {
      localStorage.setItem(`${platform}_token`, token);
      localStorage.setItem('user', JSON.stringify(userData));
      login(userData);
      navigate('/');
    };

    if (githubToken && firstName && lastName) {
      handleSocialLogin(githubToken, 'github', {
        firstName,
        lastName,
        isFirstLogin: true,
      });
    } else if (discordToken && firstName && lastName) {
      handleSocialLogin(discordToken, 'discord', {
        firstName,
        lastName,
        isFirstLogin: true,
      });
    } else if (spotifyToken) {
      handleSocialLogin(spotifyToken, 'spotify', {
        firstName: 'Spotify',
        lastName: 'User',
        isFirstLogin: true,
      });
    } else if (firstName && lastName) {
      login({ firstName, lastName, isFirstLogin });
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
    if (formData.identifier && formData.password) {
      try {
        const response = await axios.post<LoginResponse>(`https://localhost:${BACKEND_PORT}/api/login`, {
          lastFirstName: formData.identifier,
          password: formData.password,
        });
  
        const user = response.data.user;
        login(user);
        if (user.isFirstLogin) {
          alert(`Bienvenue, ${user.firstName} ${user.lastName} !`);
        } else {
          alert(`Bon retour parmi nous, ${user.firstName} ${user.lastName} !`);
        }
        navigate('/');
      } catch (error: any) {
        console.error('Error during login:', error.response?.data || error.message);
        alert(error.response?.data?.error || 'Login failed. Please try again.');
      }
    }
  };
  

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      } transition-colors duration-200`}
    >
      <div
        className={`max-w-md w-full p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-lg`}
      >
        <h2
          className={`text-3xl font-bold text-center mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('login.title')}
        </h2>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Nom Prénom"
            value={formData.identifier}
            onChange={handleInputChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
          >
            Login
          </button>
        </form>

        <div className="space-y-4 mt-6">
          <a
            href={`https://localhost:${BACKEND_PORT}/api/auth/linkedin`}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center"
          >
            {t('login.with_linkedin')}
          </a>

          <a
            href={`https://localhost:${BACKEND_PORT}/api/auth/spotify`}
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded text-center"
          >
            {t('login.with_spotify')}
          </a>

          <a
            href={`https://localhost:${BACKEND_PORT}/api/auth/discord`}
            className="block w-full bg-[#7289DA] hover:bg-[#6A7EC5] text-white font-bold py-3 px-4 rounded text-center"
          >
            {t('login.with_discord')}
          </a>

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
