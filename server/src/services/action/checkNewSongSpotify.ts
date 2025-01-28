import UserModel from '../../db/UserModel';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: `http://localhost:${process.env.BACKEND_PORT}/api/auth/spotify/callback`
  });

export const checkNewSpotifyTrack = async (email: string): Promise<string> => {
    try {
        // Récupérer l'utilisateur depuis la base de données
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error(`User with email "${email}" not found.`);
        }

        // Récupérer le token d'accès et l'ID utilisateur Spotify
        const apiKeysMap = user.apiKeys as Map<string, string>;
        const idServiceMap = user.idService as Map<string, string>;

        const spotifyAccessToken = apiKeysMap.get('spotify');
        const spotifyUserId = idServiceMap.get('spotify');

        if (!spotifyAccessToken || !spotifyUserId) {
            throw new Error(`Spotify information missing for user "${email}".`);
        }

        // Configurer le token d'accès pour l'API Spotify
        spotifyApi.setAccessToken(spotifyAccessToken);

        // Récupérer les musiques enregistrées dans Spotify
        const savedTracksResponse = await spotifyApi.getMySavedTracks();
        const spotifySavedTracks = savedTracksResponse.body.items.map(
            (track) => track.track.id
        );

        // Récupérer les musiques sauvegardées dans la base de données
        const savedTracksInDB = user.spotify?.savedTracks;

        // Comparer les musiques existantes avec les nouvelles
        const newTracks = spotifySavedTracks.filter(
            (trackId) => !savedTracksInDB.includes(trackId)
        );

        if (newTracks.length > 0) {
            // Mettre à jour la base de données avec les nouvelles musiques
            user.spotify.savedTracks = spotifySavedTracks;
            await user.save();

            return 'Une nouvelle musique a été ajoutée à votre playlist Spotify !';
        }

        return 'Aucune nouvelle musique trouvée dans votre playlist Spotify.';
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error in checkNewSpotifyTrack:', error.message);
            throw new Error(error.message);
        } else {
            console.error('An unknown error occurred.');
            throw new Error('An unknown error occurred.');
        }
    }
};
