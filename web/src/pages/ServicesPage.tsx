import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { IoLogoGithub, IoLogoDiscord } from 'react-icons/io5';
import { SiSpotify, SiLinkedin } from 'react-icons/si';

interface ServiceState {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isConnected: boolean;
}

const userEmail = localStorage.getItem('userEmail');

const ServicesPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [services, setServices] = useState<ServiceState[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: t('services.github.description'),
      icon: IoLogoGithub,
      color: 'bg-gray-900',
      isConnected: false,
    },
    {
      id: 'spotify',
      name: 'Spotify',
      description: t('services.spotify.description'),
      icon: SiSpotify,
      color: 'bg-green-600',
      isConnected: false,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: t('services.linkedin.description'),
      icon: SiLinkedin,
      color: 'bg-blue-600',
      isConnected: false,
    },
  ]);

  useEffect(() => {
    fetchServicesStatus();
  }, []);

  const fetchServicesStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/services/status`,
        {
          credentials: 'include',
        }
      );
      const data = await response.json();

      setServices((prevServices) =>
        prevServices.map((service) => ({
          ...service,
          isConnected: data[service.id] === true,
        }))
      );
    } catch (error) {
      console.error('Error fetching services status:', error);
    }
  };

  const handleServiceConnection = async (serviceId: string) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found');
        return;
      }

      // Define base URL and endpoints for each service
      const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || 8080;
      const FRONTEND_PORT = process.env.REACT_APP_FRONTEND_PORT || 8081;

      const endpoints: { [key: string]: string } = {
        github: `http://localhost:8080/api/auth/github`,
        spotify: `http://localhost:8080/api/auth/spotify`,
        linkedin: `http://localhost:8080/api/auth/linkedin`,
      };

      // Construct redirect URI for the frontend callback
      const redirectUri = `http://localhost:8081`;

      // Build the complete auth URL with query parameters
      const authUrl = `${endpoints[serviceId]}?email=${encodeURIComponent(userEmail)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

      // Redirect to the authentication endpoint
      window.location.href = authUrl;
    } catch (error) {
      console.error(`Error connecting to ${serviceId}:`, error);
    }
  };

  const handleDisconnect = async (serviceId: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/services/${serviceId}/disconnect`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (response.ok) {
        setServices((prevServices) =>
          prevServices.map((service) =>
            service.id === serviceId
              ? { ...service, isConnected: false }
              : service
          )
        );
      }
    } catch (error) {
      console.error(`Error disconnecting ${serviceId}:`, error);
    }
  };

  return (
    <div
      className={`min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {t('services.title')}
          </h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-lg shadow-lg p-6 ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-50'
              } transition-colors duration-200`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 ${service.color} rounded-full`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3
                  className={`ml-4 text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {service.name}
                </h3>
              </div>

              <p
                className={`mb-6 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {service.description}
              </p>

              <button
                onClick={() => handleServiceConnection(service.id)}
                className={`px-4 py-2 rounded-md text-white ${service.color}`}
              >
                {service.isConnected
                  ? t('services.disconnect')
                  : t('services.connect')}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
