import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { IoMail, IoCall, IoLocation, IoSend } from 'react-icons/io5';

const ContactPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} pt-20 px-4 pb-8 transition-colors duration-200`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {t('contact.title')}
          </h1>
          <p
            className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-full">
                <IoMail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Email
                </h3>
                <p
                  className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  thomas.gaboriaud@epitech.eu
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-full">
                <IoCall className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {t('contact.phone')}
                </h3>
                <p
                  className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  +33 7 68 05 09 51
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-full">
                <IoLocation className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {t('contact.address')}
                </h3>
                <p
                  className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Bordeaux, France
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  required
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('contact.form.subject')}
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('contact.form.message')}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg
                transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>{t('contact.form.send')}</span>
              <IoSend className="w-5 h-5" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
