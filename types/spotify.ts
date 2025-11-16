export interface SpotifyTrack {
  type: 'track';
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[]; album_type: string; id: string };
  external_urls: { spotify: string };
  duration_ms: number;
  progress_ms?: number;
}

export interface SpotifyAlbum {
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
  external_urls: { spotify: string };
}

export interface CurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack | null;
  timestamp: number;
  progress_ms: number | null;
  currently_playing_type: 'track' | 'episode' | 'unknown';
  context: unknown;
}

export interface SpotifyData {
  currentTrack: CurrentlyPlaying | null;
  topAlbum: SpotifyAlbum | null;
  artistTrackCount: number;
}