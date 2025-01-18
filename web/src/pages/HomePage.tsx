import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

const HomePage: React.FC = () => {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [recognizedTrack, setRecognizedTrack] = useState<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
        
        if (isSpotifyConnected) {
          const spotifyToken = localStorage.getItem('spotify_token');
          const saveResponse = await fetch(`https://localhost:${BACKEND_PORT}/api/spotify/save-track`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${spotifyToken}`
            },
            body: JSON.stringify({
              trackName: data.result.title,
              artist: data.result.artist
            })
          });
  
          if (saveResponse.ok) {
            await fetch(`https://localhost:${BACKEND_PORT}/api/telegram/notify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title: data.result.title,
                artist: data.result.artist,
                imageUrl: data.result.spotify?.album?.images[0]?.url || data.result.album_art
              })
            });
            
            alert('Musique reconnue, ajoutée à vos favoris et notification envoyée !');
          } else {
            alert('Musique reconnue mais erreur lors de l\'ajout aux favoris');
          }
        } else {
          alert('Musique reconnue ! Connectez-vous à Spotify pour l\'ajouter à vos favoris.');
        }
      } else {
        alert('Aucune musique reconnue');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la reconnaissance');
    }
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
    </div>
  );
};

export default HomePage;