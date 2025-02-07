import SpotifyWebApi from 'spotify-web-api-node';
import userModel from '../../db/userModel';

interface SpotifyPlayResponse {
  message: string;
  trackUrl?: string;
}

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let lastPlayedTrackId: string | null = null;
const PLAY_COOLDOWN = 5000;
let lastPlayTime = 0;

export const playTrack_spotify = async (
  email: string,
  option: string,
  actionResult?: any
): Promise<SpotifyPlayResponse | null> => {
  try {
    const currentTime = Date.now();
    if (currentTime - lastPlayTime < PLAY_COOLDOWN) {
      console.log('⏳ Délai minimum non respecté:', currentTime - lastPlayTime);
      return null;
    }

    console.log('🎵 Tentative de lecture de musique Spotify:', option);
    const user = await userModel.findOne({ email });
    
    if (!user) {
      throw new Error(`Utilisateur avec l'email "${email}" non trouvé.`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const spotifyToken = apiKeysMap.get('spotify');

    if (!spotifyToken) {
      throw new Error('Token Spotify manquant');
    }

    spotifyApi.setAccessToken(spotifyToken);

    const trackId = option.split('/').pop() || '';
    
    if (trackId === lastPlayedTrackId) {
      console.log('🔄 Cette piste est déjà en lecture');
      return null;
    }

    await spotifyApi.play({
      uris: [`spotify:track:${trackId}`]
    });

    lastPlayedTrackId = trackId;
    lastPlayTime = currentTime;

    return {
      message: `▶️ Lecture de la musique lancée sur Spotify\nURL: ${option}`,
      trackUrl: option
    };

  } catch (error) {
    console.error('❌ Erreur dans playTrack_spotify:', error);
    throw new Error(`Erreur lors de la lecture de la musique: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};