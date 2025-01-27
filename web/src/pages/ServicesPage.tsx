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
      id: 'linkedin',
      name: 'LinkedIn',
      description: t('services.linkedin.description'),
      icon: SiLinkedin,
      color: 'bg-blue-600',
      isConnected: false
    }
  ]);

  useEffect(() => {
    // Charger l'état des connexions au chargement de la page
    fetchServicesStatus();
  }, []);

  const fetchServicesStatus = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/status`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      setServices(prevServices => 
        prevServices.map(service => ({
          ...service,
          isConnected: data[service.id] === true
        }))
      );
    } catch (error) {
      console.error('Error fetching services status:', error);
    }
  };

  const handleConnect = async (serviceId: string) => {
    try {
      window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/${serviceId}`;
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
          credentials: 'include'
        }
      );

      if (response.ok) {
        setServices(prevServices =>
          prevServices.map(service =>
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
    <div className={`min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('services.title')}
          </h1>
          <p className={`${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
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
                <h3 className={`ml-4 text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {service.name}
                </h3>
              </div>
              
              <p className={`mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {service.description}
              </p>

              <button
                onClick={() => service.isConnected 
                  ? handleDisconnect(service.id)
                  : handleConnect(service.id)
                }
                className={`w-full py-2 px-4 rounded-md transition-all duration-200 ${
                  service.isConnected
                    ? `bg-red-500 hover:bg-red-600 text-white`
                    : `${service.color} hover:opacity-90 text-white`
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode 
                    ? 'focus:ring-offset-gray-800' 
                    : 'focus:ring-offset-white'
                } ${
                  service.isConnected 
                    ? 'focus:ring-red-500' 
                    : 'focus:ring-blue-500'
                }`}
              >
                {service.isConnected 
                  ? t('services.disconnect')
                  : t('services.connect')
                }
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;