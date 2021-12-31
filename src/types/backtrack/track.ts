import { BacktrackAlbumSimple } from './album';
import { BacktrackArtistSimple } from './artist';
import { BacktrackObject } from './index';
import { BacktrackTopObject } from './top';

export interface BacktrackTrack extends BacktrackObject {
  name: string;
  explicit: boolean;
  durationMs: number;
  spotifyPopularity: number;
  externalIds: Record<string, unknown> & { spotify?: string[] };
  albums: BacktrackAlbumSimple[];
  artists: BacktrackArtistSimple[];
}
export interface BacktrackRecentlyPlayedTrack extends BacktrackObject {
  endTime: Date;
  track: BacktrackTrack;
}

export interface BacktrackTopTrack extends BacktrackTopObject {
  track: BacktrackTrack;
}
