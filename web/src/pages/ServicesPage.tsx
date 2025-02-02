import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { IoLogoGithub, IoLogoDiscord, IoLogoDropbox } from 'react-icons/io5';
import { SiSpotify, SiLinkedin, SiNotion } from 'react-icons/si';

interface ServiceState {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isConnected: boolean;
}

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
      isConnected: false
    },
    {
      id: 'spotify',
      name: 'Spotify',
      description: t('services.spotify.description'),
      icon: SiSpotify, 
      color: 'bg-green-600',
      isConnected: false
    },
    {
      id: 'dropbox',
      name: 'dropbox',
      description: t('services.dropbox.description'),
      icon: IoLogoDropbox,
      color: 'bg-blue-600',
      isConnected: false
    },
    {
      id: 'notion',
      name: 'Notion',
      description: t('services.notion.description'),
      icon: SiNotion,
      color: 'bg-blue-600',
      isConnected: false
    },

  ]);

  const [connectedServices, setConnectedServices] = useState<string[]>([]);

  const fetchServicesStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const userEmail = localStorage.getItem('userEmail');
      
      const response = await fetch('http://localhost:8080/api/get_login_service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();
      
      setServices((prevServices) =>
        prevServices.map((service) => ({
          ...service,
          isConnected: data.activeServices.includes(service.id)
        }))
      );

    } catch (error) {
      console.error('Error fetching services status:', error);
    }
  };

  // Call this when component mounts
  useEffect(() => {
    fetchServicesStatus();
  }, []);

  const handleServiceConnection = async (serviceId: string) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found');
        return;
      }

      const FRONTEND_PORT = process.env.REACT_APP_FRONTEND_PORT || 8081;
      const redirectUri = `http://localhost:${FRONTEND_PORT}`;

      const authUrl = `http://localhost:8080/api/auth/${serviceId}?email=${encodeURIComponent(userEmail)}&redirectUri=${encodeURIComponent(redirectUri)}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error(`Error connecting to ${serviceId}:`, error);
    }
  };

  const handleDisconnect = async (serviceId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/services/${serviceId}/disconnect`,
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8`}>
      <div className="max-w-7xl mx-auto pt-20">
        {/* Proper heading hierarchy - starting with h1 */}
        <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('services.title')}
        </h1>
        <p className={`mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('services.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } transition-colors duration-200 flex flex-col min-h-[250px]`}
            >
              <div className="flex-none">
                <div className="flex items-center mb-4">
                  <div className={`p-3 ${service.color} rounded-full`}>
                    <service.icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  {/* Changed from h3 to h2 for proper hierarchy */}
                  <h2 className={`ml-4 text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.name}
                  </h2>
                </div>

                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {service.description}
                </p>
              </div>

              <div className="flex-none mt-auto">
                <button
                  onClick={() =>
                    service.isConnected
                      ? handleDisconnect(service.id)
                      : handleServiceConnection(service.id)
                  }
                  // Improved color contrast using a darker green that meets WCAG standards
                  className={`w-full px-4 py-2 rounded-md text-white ${
                    service.isConnected 
                      ? 'bg-red-700 hover:bg-red-800' 
                      : 'bg-green-700 hover:bg-green-800'
                  } transition-colors duration-200`}
                  aria-label={`${service.isConnected ? 'Disconnect from' : 'Connect to'} ${service.name}`}
                >
                  {service.isConnected
                    ? t('services.disconnect')
                    : t('services.connect')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;