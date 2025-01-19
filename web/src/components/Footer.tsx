import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <footer className={`${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
    } p-4 transition-colors duration-200`}>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} AREA. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;