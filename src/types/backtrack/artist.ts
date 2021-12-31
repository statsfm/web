import { BacktrackObject } from './index';
import { BacktrackTopObject } from './top';

export interface BacktrackArtistSimple extends BacktrackObject {
  name: string;
}

export interface BacktrackArtist extends BacktrackArtistSimple {
  followers: number;
  image: string;
  spotifyPopularity: number;
  externalIds: Record<string, unknown> & { spotify?: string[] };
  genres: string[];
}

export interface BacktrackTopArtist extends BacktrackTopObject {
  artist: BacktrackArtist;
}
