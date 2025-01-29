import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import {
  IoLogoGithub,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoMail,
  IoHome,
  IoInformationCircle,
  IoCall,
} from 'react-icons/io5';

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <footer
      className={`${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
      } pt-12 pb-6 transition-colors duration-200`}
    >
      <div className="container mx-auto px-4">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              AREA
            </h3>
            <p className="text-sm">{t('footer.description')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.quick_links')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                >
                  <IoHome className="w-4 h-4" />
                  <span>{t('footer.home')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                >
                  <IoInformationCircle className="w-4 h-4" />
                  <span>{t('footer.about')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                >
                  <IoCall className="w-4 h-4" />
                  <span>{t('footer.contact')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact_us')}</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <IoMail className="w-4 h-4" />
                <span>contact@area.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.follow_us')}</h4>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                <IoLogoGithub className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                <IoLogoLinkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-300 transition-colors"
              >
                <IoLogoTwitter className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} pt-6`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-sm">
              &copy; {new Date().getFullYear()} AREA. {t('footer.rights')}
            </p>

            {/* Legal Links */}
            <div className="flex space-x-4 text-sm">
              <Link
                to="/privacy"
                className="hover:text-blue-500 transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link
                to="/terms"
                className="hover:text-blue-500 transition-colors"
              >
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
