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
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4">
        {/* Footer Grid - Ajuster les colonnes et l'espacement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"> {/* Changé de 4 à 3 colonnes */}
          {/* Company Info - Ajuster la largeur */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              AREA
            </h2>
            <p className="text-sm" role="text">{t('footer.description')}</p>
          </div>

          {/* Quick Links - Centré */}
          <nav aria-label="Quick links" className="flex flex-col items-center">
            <h2 className="font-semibold mb-4 text-lg">{t('footer.quick_links')}</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                  aria-label={`${t('footer.home')} page`}
                >
                  <IoHome className="w-4 h-4" aria-hidden="true" />
                  <span>{t('footer.home')}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                >
                  <IoInformationCircle className="w-4 h-4" aria-hidden="true" />
                  <span>{t('footer.about')}</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Links - Aligné à droite */}
          <div className="flex flex-col items-center">
            <h2 className="font-semibold mb-4 text-lg">{t('footer.follow_us')}</h2>
            <div className="flex space-x-4" aria-label="Social media links">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                aria-label="Visit our GitHub page"
              >
                <IoLogoGithub className="w-5 h-5" aria-hidden="true" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                aria-label="Visit our LinkedIn page"
              >
                <IoLogoLinkedin className="w-5 h-5" aria-hidden="true" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-300 transition-colors"
                aria-label="Visit our Twitter page"
              >
                <IoLogoTwitter className="w-5 h-5" aria-hidden="true" />
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
