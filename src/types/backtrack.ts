export interface BacktrackObject {
  id: number;
  updatedAt?: Date;
}

export enum BacktrackTopIndicator {
  UP,
  DOWN,
  NEW,
  SAME,
  NONE
}

/*
 * Track
 */

export interface BacktrackTrack {
  id: number;
  name: string;
  explicit: boolean;
  durationMs: number;
  spotifyPopularity: number;
  externalIds: Record<string, unknown>;
  albums: BacktrackAlbumSimple[];
  artists: BacktrackArtistSimple[];
}

export interface BacktrackTopTrack {
  position: number;
  streams: number;
  playedMs: number;
  indicator: BacktrackTopIndicator;
  track: BacktrackTrack;
}

export interface BacktrackRecentlyPlayedTrack {
  endTime: Date;
  track: BacktrackTrack;
}

/*
 * Artist
 */

export interface BacktrackArtistSimple {
  id: number;
  slug: string;
  name: string;
}

export interface BacktrackArtist extends BacktrackArtistSimple {
  image: string;
  followers: number;
  genres: string[];
  spotifyPopularity: number;
  externalIds: Record<string, unknown>;
}

export interface BacktrackTopArtist {
  position: number;
  streams: number;
  playedMs: number;
  indicator: BacktrackTopIndicator;
  artist: BacktrackArtist;
}

export interface BacktrackAlbumSimple {
  id: number;
  name: string;
  image: string;
}

/*
 * Album
 */

export interface BacktrackAlbum extends BacktrackAlbumSimple {
  label: string;
  totalTracks: number;
  releaseDate: Date;
  genres: string[];
  type: string;
  spotifyPopularity: number;
  externalIds: Record<string, unknown>;
  artists: BacktrackArtist[];
}

export interface BacktrackTopAlbum {
  position: number;
  streams: number;
  playedMs: number;
  indicator: BacktrackTopIndicator;
  album: BacktrackAlbum;
}

/*
 * Genre
 */
export interface BacktrackGenre extends BacktrackGenreSimple {
  related: BacktrackGenreSimple[];
  artists: BacktrackArtist[];
}

export interface BacktrackGenreSimple {
  tag: string;
}

/*
 * Stream
 */
export interface BacktrackStream {
  id: string;
  userId: string;
  endTime: Date;
  playedMs: number;
  trackId: number;
  trackName: string;
  albumId: number;
  artistIds: number[];
  importId: number;
}

/*
 * User
 */
export interface BacktrackUser {
  id: string;
  displayName: string;
  disabled: boolean;
  syncEnabled: boolean;
  isPlus: boolean;
  apiClientId: string;
  imports: BacktrackUserImport[];
  settings: BacktrackUserSettings;
  sharingSettings: BacktrackSharingSettings;
}

export interface BacktrackUserSettings {
  accessToken: string;
  accessTokenExpiration: Date;
}

export interface BacktrackUserImport {
  id: number;
  hash: string;
  count: number;
  status: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  serverId: number;
  name: string;
}

/*
 * Friend
 */

export interface BacktrackFriend {
  id: string;
  displayName: string;
  image: string;
  country: string;
  sharingSettings: BacktrackSharingSettings;
}

export interface BacktrackFriendStats {
  user: BacktrackFriend;
  recentlyPlayed: BacktrackRecentlyPlayedTrack[];
  artists: BacktrackTopArtist[];
  tracks: BacktrackTopTrack[];
}

export interface BacktrackFriendRequest {
  friend: BacktrackFriend;
  createdAt: Date;
}

export enum BacktrackSharingSettings {
  NONE,
  FRIENDS,
  ALL
}

export enum BacktrackFriendStatus {
  NONE,
  FRIENDS,
  REQUEST_INCOMING,
  REQUEST_OUTGOING
}
