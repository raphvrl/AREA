import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import axios from 'axios';

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

    if (firstName && lastName) {
      login({ firstName, lastName, isFirstLogin });
      if (isFirstLogin) {
        alert(`Bienvenue, ${firstName} ${lastName} !`);
      } else {
        alert(`Bon retour parmi nous, ${firstName} ${lastName} !`);
      }
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
        const response = await axios.post<LoginResponse>('https://localhost:8080/api/login', {
          lastFirstName: formData.identifier,
          password: formData.password,
        });

        console.log('API response:', response.data);
        login(response.data.user);
        if (response.data.user.isFirstLogin) {
          alert(`Bienvenue, ${response.data.user.firstName} ${response.data.user.lastName} !`);
        } else {
          alert(`Bon retour parmi nous, ${response.data.user.firstName} ${response.data.user.lastName} !`);
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
            href="https://localhost:8080/api/auth/linkedin"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center"
          >
            {t('login.with_linkedin')}
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${
                  isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                }`}
              >
                {t('login.or')}
              </span>
            </div>
          </div>

          <a
            href="https://localhost:8080/api/auth/spotify"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded text-center"
          >
            {t('login.with_spotify')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
