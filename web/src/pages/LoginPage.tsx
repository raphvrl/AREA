import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const firstName = urlParams.get('firstName');
    const lastName = urlParams.get('lastName');
    const isFirstLogin = urlParams.get('isFirstLogin') === 'true';
    const spotifyToken = urlParams.get('spotify_token');
    
    if (spotifyToken) {
      // Sauvegarder le token Spotify
      localStorage.setItem('spotify_token', spotifyToken);
      
      // Créer un utilisateur Spotify comme pour LinkedIn
      const spotifyUser = {
        firstName: 'Spotify',
        lastName: 'User',
        isFirstLogin: true
      };
      
      // Sauvegarder l'utilisateur comme pour LinkedIn
      localStorage.setItem('user', JSON.stringify(spotifyUser));
      login(spotifyUser);
      navigate('/');
      return;
    }

    if (firstName && lastName) {
      login({ firstName, lastName, isFirstLogin });
      navigate('/');
    }
  }, [navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <div className="space-y-4">
          <a
            href="https://localhost:5000/api/auth/linkedin"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded text-center"
          >
            Se connecter avec LinkedIn
          </a>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>
          
          <a
            href="https://localhost:5000/api/auth/spotify"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded text-center"
          >
            Se connecter avec Spotify
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;