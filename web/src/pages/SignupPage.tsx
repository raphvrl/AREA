import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 8080;

interface SignupResponse {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    isFirstLogin: boolean;
  };
}

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = t('signup.errors.required_firstname');
    if (!formData.lastName) newErrors.lastName = t('signup.errors.required_lastname');
    if (!formData.email) newErrors.email = t('signup.errors.required_email');
    if (!formData.password) newErrors.password = t('signup.errors.required_password');
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('signup.errors.passwords_match');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const response = await axios.post<SignupResponse>(
        `http://localhost:${BACKEND_PORT}/api/sign_up`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.user) {
        login(response.data.user);
        navigate('/');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.data?.errors) {
        // Handle validation errors from express-validator
        const validationErrors = error.response.data.errors;
        const newErrors: Record<string, string> = {};
        validationErrors.forEach((err: any) => {
          newErrors[err.param] = err.msg;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: t('signup.errors.general') });
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      } transition-colors duration-200`}
    >
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
            {t('signup.create_account')}
          </h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('signup.subtitle')}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <input
              type="text"
              name="firstName"
              placeholder={t('signup.firstname')}
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder={t('signup.lastname')}
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder={t('signup.email')}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder={t('signup.password')}
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder={t('signup.confirm_password')}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('signup.already_have_account')}{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
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
