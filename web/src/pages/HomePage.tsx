import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { Area, Action, Reaction } from '../types/area';
import { availableActions, availableReactions } from '../constants/actions';
import { AreaModal } from '../components/AreaModal';
import { AreaCard } from '../components/AreaCard';

const userEmail = localStorage.getItem('userEmail');
const BACKEND_PORT = process.env.BACKEND_PORT || 8080;
const FRONTEND_PORT = process.env.REACT_APP_FRONTEND_PORT || 8081;

const HomePage: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [areaName, setAreaName] = useState('');
  const [actionOption, setActionOption] = useState('');
  const [reactionOption, setReactionOption] = useState('');

  const { isAuthenticated, user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Gérer le retour du callback OAuth
  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state'); // Le state est une chaîne JSON
  
    if (code && state) {
      try {
        // Parser le state pour extraire l'URL du service
        const parsedState = JSON.parse(state);
        const serviceUrl = parsedState.service; // Récupérer l'URL du service
  
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          console.error('No user email found');
          return;
        }
  
        // Envoyer le code et l'email au backend pour finaliser la connexion
        const response = await fetch(
          `http://localhost:${BACKEND_PORT}${serviceUrl}`, // Utiliser l'URL du service
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, email: userEmail }),
          }
        );
  
        if (response.ok) {
          // Mettre à jour l'état de l'application si nécessaire
          console.log('Service connected successfully:', serviceUrl);
          navigate('/services');
        } else {
          const error = await response.json();
          console.error('Error handling callback:', error.message);
        }
      } catch (error) {
        console.error('Error handling callback:', error);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Gérer le callback OAuth au chargement de la page
    handleCallback();

    // Charger les zones de l'utilisateur
    fetchAreas();
  }, [isAuthenticated, navigate, user?.email]);

  const fetchAreas = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(
        `http://localhost:${BACKEND_PORT}/api/getArea/${user.email}`,
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      if (data.areas) {
        const formattedAreas = data.areas.map((area: any) => ({
          id: area.nomArea,
          name: area.nomArea,
          action: {
            type: area.action,
            service: area.action.split('_')[1],
          },
          reaction: {
            type: area.reaction,
            service: area.reaction.split('_')[1],
          },
          isActive: area.is_on === 'true',
        }));
        setAreas(formattedAreas);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const handleCreateArea = async () => {
    if (!selectedAction || !selectedReaction || !areaName || !user?.email) {
      alert(t('home.areas.fill_all_fields'));
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:${BACKEND_PORT}/api/setArea`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            emailUser: user.email,
            nomArea: areaName,
            action: `${selectedAction.type}_${selectedAction.service}`,
            reaction: `${selectedReaction.type}_${selectedReaction.service}`,
            option_action: selectedAction.hasOptions ? actionOption : undefined,
            option_reaction: selectedReaction.hasOptions ? reactionOption : undefined
          }),
        }
      );

      if (response.ok) {
        await fetchAreas();
        setShowCreateModal(false);
        resetForm();
        setActionOption('');
        setReactionOption('');
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error creating area:', error);
    }
  };

  const handleDeleteArea = async (areaId: string) => {
    if (!user?.email) return;

    try {
      await fetch(`http://localhost:${BACKEND_PORT}/api/deleteArea`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: user.email,
          nomArea: areaId,
        }),
      });
      setAreas(areas.filter((area) => area.id !== areaId));
    } catch (error) {
      console.error('Error deleting area:', error);
    }
  };

  const handleToggle = async (area: Area) => {
    if (!user?.email) {
      console.error('User email not found');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:${BACKEND_PORT}/api/setArea`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            emailUser: user.email,
            nomArea: area.id,
            action: area.action.type,
            reaction: area.reaction.type,
            is_on: !area.isActive ? 'true' : 'false',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update area state');
      }

      setAreas(
        areas.map((a) =>
          a.id === area.id ? { ...a, isActive: !a.isActive } : a
        )
      );
    } catch (error) {
      console.error('Error toggling area:', error);
    }
  };

  const resetForm = () => {
    setSelectedAction(null);
    setSelectedReaction(null);
    setAreaName('');
  };

  if (!isAuthenticated) return null;

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8 transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {t('home.title_welcome')}
          </h1>
          <p
            className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {t('home.subtitle_welcome')}
          </p>
        </div>

        {/* Areas Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2
              className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            >
              {t('home.areas.title')}
            </h2>
            <p
              className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {areas.length === 0
                ? t('home.areas.empty')
                : `${areas.length} ${t('home.areas.count')}`}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold 
              transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('home.areas.create')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              onToggle={handleToggle}
              onDelete={handleDeleteArea}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        <AreaModal
          show={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            resetForm();
          }}
          onSubmit={handleCreateArea}
          areaName={areaName}
          setAreaName={setAreaName}
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          availableActions={availableActions}
          availableReactions={availableReactions}
          isDarkMode={isDarkMode}
          actionOption={actionOption}
          setActionOption={setActionOption}
          reactionOption={reactionOption}
          setReactionOption={setReactionOption}
        />
      </div>
    </div>
  );
};

export default HomePage;