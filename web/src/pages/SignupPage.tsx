import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AuthError, ApiValidationError } from '../types/auth';
import { TranslationKey } from '../translations/types';

const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 8080;

interface SignupResponse {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    isFirstLogin: boolean;
  };
}

const ErrorMessage: React.FC<{ error?: AuthError }> = ({ error }) => {
  if (!error?.field?.includes('password')) return null;

  return <div className="text-red-500 text-sm mt-1">{error.message}</div>;
};

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<AuthError[]>([]);

  const validateForm = () => {
    const formErrors: AuthError[] = [];

    if (!formData.password) {
      formErrors.push({
        field: 'password',
        message: t('signup.errors.password'),
      });
    }

    if (formData.password !== formData.confirmPassword) {
      formErrors.push({
        field: 'confirmPassword',
        message: t('signup.errors.passwords_match'),
      });
    }

    setErrors(formErrors);
    return formErrors.length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors.find((error) => error.field === name)) {
      setErrors((prev) => prev.filter((error) => error.field !== name));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const signupResponse = await axios.post<SignupResponse>(
        `http://localhost:${BACKEND_PORT}/api/signUp`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }
      );

      // After successful signup, perform login
      interface LoginResponse {
        user: {
          firstName: string;
          lastName: string;
          email: string;
          isFirstLogin: boolean;
        };
      }

      const loginResponse = await axios.post<LoginResponse>(
        `http://localhost:${BACKEND_PORT}/api/signIn`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (loginResponse.data.user) {
        localStorage.setItem('userEmail', formData.email);
        login(loginResponse.data.user);
        navigate('/');
      }
    } catch (error: any) {
      console.error('Signup error:', error);

      if (error.response?.data?.errors) {
        const apiErrors = error.response.data as ApiValidationError;
        const mappedErrors =
          apiErrors.errors?.map((err) => {
            const translationKey =
              `signup.errors.${err.param}` as TranslationKey;
            return {
              field: err.param,
              message: t(translationKey) || err.msg,
            };
          }) || [];
        setErrors(mappedErrors);
      } else {
        setErrors([
          {
            message: t('signup.errors.general'),
          },
        ]);
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
            ? 'bg-gray-800 text-white' // Improved contrast for dark mode
            : 'bg-white text-gray-900' // Maximum contrast for light mode
        } rounded-2xl shadow-2xl space-y-6`}
      >
        <div className="text-center">
          <h2
            className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {t('signup.create_account')}
          </h2>
          <p
            className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {t('signup.subtitle')}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          {errors
            .filter((e) => !e.field)
            .map((error, index) => (
              <div key={index} className="text-red-500 text-sm text-center">
                {error.message}
              </div>
            ))}
          <div>
            <input
              type="text"
              name="firstName" 
              placeholder={t('signup.firstname')}
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.find((e) => e.field === 'firstName') ? 'border-red-500' : ''
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
            />
            <ErrorMessage error={errors.find((e) => e.field === 'firstName')} />
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder={t('signup.lastname')}
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.find((e) => e.field === 'firstName') ? 'border-red-500' : ''
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
            />
            <ErrorMessage error={errors.find((e) => e.field === 'lastName')} />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder={t('signup.email')}
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.find((e) => e.field === 'firstName') ? 'border-red-500' : ''
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`} 
            />
            <ErrorMessage error={errors.find((e) => e.field === 'email')} />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder={t('signup.password')}
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.find((e) => e.field === 'firstName') ? 'border-red-500' : ''
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
            />
            <ErrorMessage error={errors.find((e) => e.field === 'password')} />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder={t('signup.confirm_password')}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.find((e) => e.field === 'firstName') ? 'border-red-500' : ''
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
            />
            <ErrorMessage
              error={errors.find((e) => e.field === 'confirmPassword')}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transform transition-all duration-200 hover:scale-[1.02]"
          >
            {t('signup.create_account')}
          </button>
        </form>

        <div className="text-center mt-6">
          <p
            className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            {t('signup.already_have_account')}{' '}
            <Link
              to="/login"
              className={`font-medium ${
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300' // Lighter blue for dark mode (better contrast)
                  : 'text-blue-700 hover:text-blue-800' // Darker blue for light mode (better contrast)
              } transition-colors duration-200`}
              aria-label="Back to login page"
            >
              {t('signup.sign_in')}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
