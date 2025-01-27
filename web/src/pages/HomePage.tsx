// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { Area, Action, Reaction } from '../types/area';
import { availableActions, availableReactions } from '../constants/actions';
import { AreaModal } from '../components/AreaModal';
import { AreaCard } from '../components/AreaCard';

const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

const HomePage: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [areaName, setAreaName] = useState('');

  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchAreas = async () => {
      try {
        const response = await fetch(`http://localhost:${BACKEND_PORT}/api/areas`, {
          credentials: 'include'
        });
        const data = await response.json();
        setAreas(data);
      } catch (error) {
        console.error('Error fetching areas:', error);
      }
    };

    fetchAreas();
  }, [isAuthenticated, navigate]);

  const handleCreateArea = async () => {
    if (!selectedAction || !selectedReaction || !areaName) {
      alert(t('home.areas.fill_all_fields'));
      return;
    }

    const tempId = Date.now().toString();
    const tempArea = {
      id: tempId,
      name: areaName,
      action: {
        service: selectedAction.service,
        type: selectedAction.type,
        description: selectedAction.description
      },
      reaction: {
        service: selectedReaction.service,
        type: selectedReaction.type,
        description: selectedReaction.description
      },
      isActive: true
    };

    setAreas(prevAreas => [...prevAreas, tempArea]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleDeleteArea = async (areaId: string) => {
    try {
      await fetch(`http://localhost:${BACKEND_PORT}/api/areas/${areaId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setAreas(areas.filter(area => area.id !== areaId));
    } catch (error) {
      console.error('Error deleting area:', error);
    }
  };

  const handleToggleArea = async (area: Area) => {
    try {
      const updatedArea = { ...area, isActive: !area.isActive };
      await fetch(`http://localhost:${BACKEND_PORT}/api/areas/${area.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedArea),
        credentials: 'include'
      });
      setAreas(areas.map(a => (a.id === area.id ? updatedArea : a)));
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('home.title_welcome')}
          </h1>
          <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('home.subtitle_welcome')}
          </p>
        </div>

        {/* Areas Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {t('home.areas.title')}
            </h2>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {areas.length === 0 ? t('home.areas.empty') : `${areas.length} ${t('home.areas.count')}`}
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
          {areas.map(area => (
            <AreaCard
              key={area.id}
              area={area}
              onToggle={handleToggleArea}
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
        />
      </div>
    </div>
  );
};

export default HomePage;