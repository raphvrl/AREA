import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.identifier && formData.password) {
      console.log('Form data submitted:', formData);
      // Appel à l'API à implémenter plus tard
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

        {/* Formulaire de connexion */}
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

        {/* Options de connexion */}
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
