import userModel from '../../db/userModel';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `http://localhost:${process.env.BACKEND_PORT}/api/auth/spotify/callback`,
});

interface TrackObjectFull {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string }>;
  };
}

interface SpotifyCurrentTrack {
  message: string;
  name?: string;
  artist?: string;
  imageUrl?: string;
}

let lastPlayingTrackId: string | null = null;

export const checkNewSongSpotify = async (
  email: string
): Promise<SpotifyCurrentTrack | null> => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error(`User with email "${email}" not found.`);
    }

    const apiKeysMap = user.apiKeys as Map<string, string>;
    const spotifyAccessToken = apiKeysMap.get('spotify');

    if (!spotifyAccessToken) {
      throw new Error(`Spotify token missing for user "${email}".`);
    }

    spotifyApi.setAccessToken(spotifyAccessToken);

    const currentTrack = await spotifyApi.getMyCurrentPlayingTrack();

    if (!currentTrack.body || !currentTrack.body.item) {
      return null;
    }

    const track = currentTrack.body.item as TrackObjectFull;

    if (!('artists' in track)) {
      console.log('Not a music track (might be a podcast)');
      return null;
    }

    if (track.id === lastPlayingTrackId) {
      return null;
    }

    lastPlayingTrackId = track.id;

    console.log('Nouvelle musique détectée:', {
      name: track.name,
      artist: track.artists[0].name,
    });

    return {
      message: `🎵 Nouvelle musique en lecture sur Spotify:\nTitre: ${track.name}\nArtiste: ${track.artists[0].name}`,
      name: track.name,
      artist: track.artists[0].name,
      imageUrl: track.album.images[0]?.url,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in checkNewSongSpotify:', error.message);
      throw new Error(error.message);
    } else {
      console.error('An unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};
