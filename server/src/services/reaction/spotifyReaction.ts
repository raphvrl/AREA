import axios from 'axios';
import userModel from '../../db/userModel';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

interface SpotifyResponse {
  message: string;
  playlistUrl?: string;
}

// Variables de contrôle avec mutex
const createdPlaylists = new Set<string>();
let lastPlaylistCreationTime = 0;
const CREATION_COOLDOWN = 15000;
let isCreatingPlaylist = false;

export const createPlaylist_spotify = async (
  email: string,
  option: string,
  actionResult?: any
): Promise<SpotifyResponse | null> => {
  try {
    if (isCreatingPlaylist) {
      console.log('⚠️ Création déjà en cours');
      return null;
    }

    const currentTime = Date.now();
    if (currentTime - lastPlaylistCreationTime < CREATION_COOLDOWN) {
      console.log('⏳ Délai minimum non respecté:', currentTime - lastPlaylistCreationTime);
      return null;
    }

    if (createdPlaylists.has(option)) {
      console.log('🚫 Playlist déjà créée:', option);
      return null;
    }

    isCreatingPlaylist = true;

    console.log('🎵 Tentative de création de playlist:', option);
    const user = await userModel.findOne({ email });
    
    if (!user) {
      isCreatingPlaylist = false;
      throw new Error(`Utilisateur avec l'email "${email}" non trouvé.`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const spotifyToken = apiKeysMap.get('spotify');

    if (!spotifyToken) {
      isCreatingPlaylist = false;
      throw new Error('Token Spotify manquant');
    }

    spotifyApi.setAccessToken(spotifyToken);
    
    const playlist = await spotifyApi.createPlaylist(option, {
      description: 'Playlist créée via AREA',
      public: false
    });

    createdPlaylists.add(option);
    lastPlaylistCreationTime = currentTime;
    isCreatingPlaylist = false;

    return {
      message: `🎵 Nouvelle playlist Spotify créée !\nNom: ${option}\nURL: ${playlist.body.external_urls.spotify}`,
      playlistUrl: playlist.body.external_urls.spotify
    };

  } catch (error) {
    isCreatingPlaylist = false;
    console.error('❌ Erreur dans createPlaylist_spotify:', error);
    throw error;
  }
};