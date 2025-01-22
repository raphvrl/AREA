import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

interface Action {
  id: string;
  service: string;
  type: string;
  description: string;
  config?: any;
}

interface Reaction {
  id: string;
  service: string;
  type: string;
  description: string;
  config?: any;
}

// First, modify the Area interface to match backend structure
interface Area {
  id: string;
  name: string;
  action: {
    service: string;
    type: string;
    description: string;
  };
  reaction: {
    service: string;
    type: string;
    description: string;
  };
  isActive: boolean;
}

const HomePage: React.FC = () => {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [recognizedTrack, setRecognizedTrack] = useState<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isConnectedToX, setIsConnectedToX] = useState<boolean>(false);
  const [isServiceXActive, setIsServiceXActive] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Area[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [areaName, setAreaName] = useState('');

  const availableActions: Action[] = [
    {
      id: 'spotify-track-playing',
      service: 'Spotify', 
      type: 'TRACK_PLAYING',
      description: 'When a track starts playing on Spotify'
    },
    {
      id: 'spotify-auth',
      service: 'Spotify',
      type: 'AUTH_STATUS',
      description: 'When Spotify authentication status changes'
    },
    {
      id: 'user-login',
      service: 'Auth',
      type: 'LOGIN',
      description: 'When user logs in'
    }
  ];

  const availableReactions: Reaction[] = [
    {
      id: 'spotify-play',
      service: 'Spotify',
      type: 'PLAY_TRACK',
      description: 'Play a track on Spotify',
      config: {
        timer: 30 // Default duration in seconds
      }
    },
    {
      id: 'spotify-save',
      service: 'Spotify', 
      type: 'SAVE_TRACK',
      description: 'Save current track to Spotify favorites'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const spotifyToken = localStorage.getItem('spotify_token');
    setIsSpotifyConnected(!!spotifyToken);

    const params = new URLSearchParams(window.location.search);
    const newSpotifyToken = params.get('spotify_token');
    
    if (newSpotifyToken) {
      localStorage.setItem('spotify_token', newSpotifyToken);
      setIsSpotifyConnected(true);
      window.history.replaceState({}, document.title, '/');
    }
    // Twitter (X) setup
    const connectedToX = params.get('connectedToX');
    if (connectedToX === 'true') {
      setIsConnectedToX(true);
      window.history.replaceState({}, document.title, '/');
    }

    // Check if service X is active
    fetch(`https://localhost:${BACKEND_PORT}/api/service/x/status`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setIsServiceXActive(data.isActive);
      })
      .catch((error) => console.error('Error fetching service X status:', error));

    // Fetch existing AREAs from backend
    const fetchAreas = async () => {
      try {
        const response = await fetch(`https://localhost:${BACKEND_PORT}/api/areas`, {
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

  const handleActivateServiceX = async () => {
    try {
      const response = await fetch(`https://localhost:${BACKEND_PORT}/api/service/x`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: user?.firstName,
          lastName: user?.lastName,
          is_activate: true, // Activer le service X
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to activate service X');
      }
  
      setIsServiceXActive(true); // Met à jour l'état du service dans le front
      alert('Service X activé avec succès !');
    } catch (error) {
      console.error('Error activating service X:', error);
      alert('Erreur lors de l\'activation du service X.');
    }
  };
  
  const handleDeactivateServiceX = async () => {
    try {
      const response = await fetch(`https://localhost:${BACKEND_PORT}/api/service/x`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: user?.firstName,
          lastName: user?.lastName,
          is_activate: false, // Désactiver le service X
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to deactivate service X');
      }
  
      setIsServiceXActive(false); // Met à jour l'état du service dans le front
      alert('Service X désactivé avec succès !');
    } catch (error) {
      console.error('Error deactivating service X:', error);
      alert('Erreur lors de la désactivation du service X.');
    }
  };
  

  const handleSpotifyPlay = async () => {
    try {
      const spotifyToken = localStorage.getItem('spotify_token');
      
      if (!spotifyToken) {
        alert('Veuillez d\'abord vous connecter à Spotify');
        return;
      }

      const response = await fetch(`https://localhost:${BACKEND_PORT}/api/spotify/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${spotifyToken}`
        },
        body: JSON.stringify({ timer: timerDuration })
      });

      if (response.status === 401) {
        localStorage.removeItem('spotify_token');
        setIsSpotifyConnected(false);
        alert('Session Spotify expirée. Veuillez vous reconnecter.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to play track');
      }

      alert(`La musique va jouer pendant ${timerDuration} secondes !`);
    } catch (error) {
      console.error('Error playing track:', error);
      alert('Erreur lors de la lecture. Vérifiez que Spotify est ouvert.');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (!file || !file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      alert('Veuillez déposer un fichier audio ou vidéo');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_token', process.env.REACT_APP_AUDD_API_KEY || '');

    try {
      const response = await fetch('https://api.audd.io/', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.result) {
        setRecognizedTrack(data.result);
      } else {
        alert('Aucune musique reconnue');
      }
    } catch (error) {
      console.error('Error recognizing music:', error);
      alert('Erreur lors de la reconnaissance');
    }
  };

  const addToSpotifyFavorites = async () => {
    if (!recognizedTrack || !isSpotifyConnected) return;

    try {
      const spotifyToken = localStorage.getItem('spotify_token');
      const response = await fetch(`https://localhost:${BACKEND_PORT}/api/spotify/save-track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${spotifyToken}`
        },
        body: JSON.stringify({
          trackName: recognizedTrack.title,
          artist: recognizedTrack.artist
        })
      });

      if (!response.ok) throw new Error('Failed to save track');
      alert('Musique ajoutée à vos favoris !');
    } catch (error) {
      console.error('Error saving to favorites:', error);
      alert('Erreur lors de l\'ajout aux favoris');
    }
  };

  // Update handleCreateArea function
const handleCreateArea = async () => {
  if (!selectedAction || !selectedReaction || !areaName) {
    alert("Please fill in all fields");
    return;
  }

  // Create temporary ID before making the request
  const tempId = Date.now().toString();

  // Create area object
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

  try {
    // Add to local state first for immediate feedback
    setAreas(prevAreas => [...prevAreas, tempArea]);

    // Close modal and reset form
    setShowCreateModal(false);
    resetForm();

    alert('AREA created successfully!');

  } catch (error) {
    console.error('Error creating area:', error);
    // Remove the temporary area if there's an error
    setAreas(prevAreas => prevAreas.filter(area => area.id !== tempId));
    alert('Failed to create AREA. Please try again.');
  }
};

  const handleDeleteArea = async (areaId: string) => {
    try {
      await fetch(`https://localhost:${BACKEND_PORT}/api/areas/${areaId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      setAreas(areas.filter(area => area.id !== areaId));
    } catch (error) {
      console.error('Error deleting area:', error);
    }
  };

  const handlePlayArea = async (area: Area) => {
    try {
      const response = await fetch(`https://localhost:${BACKEND_PORT}/api/areas/${area.id}/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('spotify_token')}`
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to trigger area');
      }
  
      alert(`AREA "${area.name}" triggered successfully!`);
    } catch (error) {
      console.error('Error triggering area:', error);
      alert('Failed to trigger AREA');
    }
  };

  const resetForm = () => {
    setSelectedAction(null);
    setSelectedReaction(null);
    setAreaName('');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8 transition-colors duration-200`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section Spotify */}
        <div className={`flex flex-col space-y-4 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow transition-colors duration-200`}>
          <img 
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" 
            alt="Spotify" 
            className="w-32 h-auto mx-auto mb-4"
          />
          <h3 className={`text-xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('home.spotify.title')}
          </h3>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="timer" className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('home.spotify.timer')}
            </label>
            <input
              type="number"
              id="timer"
              min="1"
              value={timerDuration}
              onChange={(e) => setTimerDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className={`border rounded-md px-3 py-2 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <button
            onClick={() => window.location.href = `https://localhost:${BACKEND_PORT}/api/auth/spotify`}
            className={`py-2 px-4 rounded transition-colors ${
              !isSpotifyConnected 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-500'
            }`}
            disabled={isSpotifyConnected}
          >
            {isSpotifyConnected ? t('home.spotify.connected') : t('home.spotify.connect')}
          </button>

          <button
            onClick={handleSpotifyPlay}
            className={`py-2 px-4 rounded ${isSpotifyConnected ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300'}`}
            disabled={!isSpotifyConnected}
          >
            {t('home.spotify.play')}
          </button>
        </div>

        {/* Section Reconnaissance musicale */}
        <div className={`flex flex-col space-y-4 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow transition-colors duration-200`}>
          <h3 className={`text-xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('home.recognition.title')}
          </h3>
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : isDarkMode 
                  ? 'border-gray-600 hover:border-blue-500' 
                  : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              {t('home.recognition.dropzone')}
            </p>
          </div>

          {recognizedTrack && (
            <div className={`mt-4 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('home.recognition.result')}
              </h4>
              <p className={`mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('home.recognition.title')}: {recognizedTrack.title}
              </p>
              <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('home.recognition.artist')}: {recognizedTrack.artist}
              </p>
              {isSpotifyConnected && (
                <button
                  onClick={addToSpotifyFavorites}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                >
                  {t('home.recognition.addToSpotify')}
                </button>
              )}
            </div>
          )}
        </div>
        {/* Section Twitter (X) */}
        <div className={`flex flex-col space-y-4 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow transition-colors duration-200`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Connexion à Twitter (X)
          </h2>
          {!isConnectedToX ? (
            <a
              href={`https://localhost:${BACKEND_PORT}/api/auth/twitter`}
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Se connecter à Twitter
            </a>
          ) : (
            <p>Connecté à Twitter !</p>
          )}
          <div className="flex space-x-4">
          <button
    onClick={handleActivateServiceX}
    className={`py-2 px-4 rounded ${isServiceXActive ? 'bg-gray-300 text-gray-500' : 'bg-green-500 text-white'}`}
    disabled={isServiceXActive}
  >
    Activer Service X
  </button>
  <button
    onClick={handleDeactivateServiceX}
    className={`py-2 px-4 rounded ${!isServiceXActive ? 'bg-gray-300 text-gray-500' : 'bg-red-500 text-white'}`}
    disabled={!isServiceXActive}
  >
    Désactiver Service X
  </button>
          </div>
        </div>
      </div>

      {/* AREA Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            My AREAs
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create New AREA
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map(area => (
            <div
              key={area.id}
              className={`p-4 rounded-lg shadow ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{area.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePlayArea(area)}
                      className="p-2 rounded bg-green-500 hover:bg-green-600 text-white transition-colors"
                      aria-label="Play AREA"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteArea(area.id)}
                      className="p-2 rounded bg-red-500 hover:bg-red-600 text-white transition-colors"
                      aria-label="Delete AREA"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex-1 text-sm">
                  <p className="mb-1"><span className="font-medium">Action:</span> {area.action.description}</p>
                  <p><span className="font-medium">Reaction:</span> {area.reaction.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create AREA Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Create New AREA
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="AREA Name"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <select
                value={selectedAction?.id || ''}
                onChange={(e) => setSelectedAction(availableActions.find(a => a.id === e.target.value) || null)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select an Action</option>
                {availableActions.map(action => (
                  <option key={action.id} value={action.id}>
                    {action.description}
                  </option>
                ))}
              </select>
              <select
                value={selectedReaction?.id || ''}
                onChange={(e) => setSelectedReaction(availableReactions.find(r => r.id === e.target.value) || null)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select a Reaction</option>
                {availableReactions.map(reaction => (
                  <option key={reaction.id} value={reaction.id}>
                    {reaction.description}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateArea}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  disabled={!selectedAction || !selectedReaction || !areaName}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;