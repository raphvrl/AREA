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

export const createPlaylist_spotify = async (
  email: string,
  option: string,
  actionResult?: any
): Promise<SpotifyResponse | null> => {
  try {
    console.log('option', option);
    console.log('🎵 Tentative de création de playlist Spotify pour:', email);
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error(`Utilisateur avec l'email "${email}" non trouvé`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const idServiceMap = user.idService as Map<string, string>;
    const spotifyToken = apiKeysMap.get('spotify');
    const spotifyUserId = idServiceMap.get('spotify');

    if (!spotifyToken || !spotifyUserId) {
      throw new Error("Informations d'authentification Spotify manquantes");
    }

    spotifyApi.setAccessToken(spotifyToken);

    // Créer la playlist avec un nom unique basé sur la date
    const playlistName = option;
    const description = 'Playlist créée automatiquement par AREA';

    const response = await spotifyApi.createPlaylist(playlistName, {
      description: description,
      public: false,
    });

    console.log(
      '✅ Playlist créée avec succès:',
      response.body.external_urls.spotify
    );
    return {
      message: `🎵 Nouvelle playlist Spotify créée !\nNom: ${playlistName}\nURL: ${response.body.external_urls.spotify}`,
      playlistUrl: response.body.external_urls.spotify,
    };
  } catch (error) {
    console.error('❌ Erreur dans createPlaylist_spotify:', error);
    if (axios.isAxiosError(error)) {
      console.error("Détails de l'erreur:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
    throw new Error(
      `Erreur lors de la création de la playlist: ${
        error instanceof Error ? error.message : 'Erreur inconnue'
      }`
    );
  }
};
