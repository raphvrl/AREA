import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { motion } from 'framer-motion';
import { IoLogoGithub, IoLogoDiscord, IoLogoDropbox } from 'react-icons/io5';
import { SiSpotify, SiNotion, SiTwitch } from 'react-icons/si';

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
    {
      id: 'twitch',
      name: 'Twitch',
      description: t('services.twitch.description'),
      icon: SiTwitch,
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
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(`http://localhost:8080/api/logoutService`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameService: serviceId,
          email: userEmail
        })
      });

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.02 }}
              className={`relative p-6 rounded-lg shadow-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Add status LED */}
              <div
                role="status"
                aria-live="polite"
                className={`absolute top-4 right-4 w-3 h-3 rounded-full 
                  ${service.isConnected 
                    ? 'bg-green-500 shadow-green-500/50' 
                    : 'bg-red-500 shadow-red-500/50'} 
                  shadow-lg transition-colors duration-300`}
              >
                <span className="sr-only">
                  {service.name} is {service.isConnected ? 'connected' : 'disconnected'}
                </span>
              </div>

              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${service.color}`}>
                    <service.icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <h2 className={`ml-4 text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.name}
                  </h2>
                </div>

                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {service.description}
                </p>

                {/* Connect button only shown when disconnected */}
                {!service.isConnected ? (
                  <div className="w-full mt-auto"> {/* Conteneur pour le bouton de connexion */}
                    <button
                      onClick={() => handleServiceConnection(service.id)}
                      className="w-full px-4 py-2 rounded-md text-white 
                        bg-green-700 hover:bg-green-800 
                        transition-colors duration-200"
                      aria-label={`Connect to ${service.name}`}
                    >
                      {t('services.connect')}
                    </button>
                  </div>
                ) : (
                  <div className="w-full mt-auto"> {/* Conteneur pour le bouton de déconnexion */}
                    <button
                      onClick={() => handleDisconnect(service.name.toLowerCase())}
                      className="w-full px-4 py-2 rounded-md text-white 
                        bg-red-600 hover:bg-red-700
                        transition-colors duration-200"
                      aria-label={`Disconnect from ${service.name}`}
                    >
                      {t('services.disconnect')}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;