import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BACKEND_PORT = process.env.BACKEND_PORT || 8080;

const HomePage: React.FC = () => {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [recognizedTrack, setRecognizedTrack] = useState<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section Spotify */}
        <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow">
          <img 
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png" 
            alt="Spotify" 
            className="w-32 h-auto mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-center">Spotify Integration</h3>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="timer" className="text-sm font-medium text-gray-700">
              Durée de lecture (secondes)
            </label>
            <input
              type="number"
              id="timer"
              min="1"
              value={timerDuration}
              onChange={(e) => setTimerDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="border rounded-md px-3 py-2"
            />
          </div>

          <button
            onClick={() => window.location.href = `https://localhost:${BACKEND_PORT}/api/auth/spotify`}
            className={`py-2 px-4 rounded ${!isSpotifyConnected ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300'}`}
            disabled={isSpotifyConnected}
          >
            {isSpotifyConnected ? 'Connecté à Spotify' : 'Se connecter à Spotify'}
          </button>

          <button
            onClick={handleSpotifyPlay}
            className={`py-2 px-4 rounded ${isSpotifyConnected ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300'}`}
            disabled={!isSpotifyConnected}
          >
            Lancer la musique
          </button>
        </div>

        {/* Section Reconnaissance musicale */}
        <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-center">Reconnaissance musicale</h3>
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            <p>Déposez un fichier audio/vidéo ici pour identifier la musique</p>
          </div>

          {recognizedTrack && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Musique reconnue :</h4>
              <p className="mb-1">Titre : {recognizedTrack.title}</p>
              <p className="mb-3">Artiste : {recognizedTrack.artist}</p>
              {isSpotifyConnected && (
                <button
                  onClick={addToSpotifyFavorites}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Ajouter aux favoris Spotify
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;