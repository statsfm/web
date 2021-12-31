import { BacktrackArtistSimple } from './artist';
import { BacktrackObject } from './index';
import { BacktrackTopObject } from './top';

export interface BacktrackAlbumSimple extends BacktrackObject {
  name: string;
  image: string;
}

export interface BacktrackAlbum extends BacktrackAlbumSimple {
  label: string;
  spotifyPopularity: number;
  totalTracks: number;
  releaseDate: Date;
  genres: string[];
  artists: BacktrackArtistSimple[];
  externalIds: Record<string, unknown> & { spotify?: string[] };
  type: 'single' | 'complication' | 'album';
}

export interface BacktrackTopAlbum extends BacktrackTopObject {
  album: BacktrackAlbum;
}
