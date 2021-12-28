enum BacktrackTopIndicator {
  UP,
  DOWN,
  NEW,
  SAME,
  NONE,
}

/*
 * Track
 */

interface BacktrackTrack {
  id: number;
  name: string;
  explicit: boolean;
  durationMs: number;
  spotifyPopularity: number;
  externalIds: Record<string, unknown>;
  albums: BacktrackAlbumSimple[];
  artists: BacktrackArtistSimple[];
}

interface BacktrackTopTrack {
  position: number;
  streams: number;
  playedMs: number;
  indicator: BacktrackTopIndicator;
  track: BacktrackTrack;
}

interface BacktrackRecentlyPlayedTrack {
  endTime: Date;
  track: BacktrackTrack;
}

/*
 * Artist
 */

interface BacktrackArtistSimple {
  id: number;
  slug: string;
  name: string;
}

interface BacktrackArtist extends BacktrackArtistSimple {
  image: string;
  followers: number;
  genres: string[];
  spotifyPopularity: number;
  externalIds: Record<string, unknown>;
}

interface BacktrackTopArtist {
  position: number;
  streams: number;
  playedMs: number;
  indicator: BacktrackTopIndicator;
  artist: BacktrackArtist;
}

interface BacktrackAlbumSimple {
  id: number;
  name: string;
  image: string;
}

/*
 * Album
 */

interface BacktrackAlbum extends BacktrackAlbumSimple {
  label: string;
  totalTracks: number;
  releaseDate: Date;
  genres: string[];
  type: string;
  spotifyPopularity: number;
  externalIds: Record<string, unknown>;
  artists: BacktrackArtist[];
}

interface BacktrackTopAlbum {
  position: number;
  streams: number;
  playedMs: number;
  indicator: BacktrackTopIndicator;
  album: BacktrackAlbum;
}

/*
 * Genre
 */
interface BacktrackGenre extends BacktrackGenreSimple {
  related: BacktrackGenreSimple[];
  artists: BacktrackArtist[];
}

interface BacktrackGenreSimple {
  tag: string;
}

/*
 * Stream
 */
interface BacktrackStream {
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
interface BacktrackUser {
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

interface BacktrackUserSettings {
  accessToken: string;
  accessTokenExpiration: Date;
}

interface BacktrackUserImport {
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

interface BacktrackFriend {
  id: string;
  displayName: string;
  image: string;
  country: string;
  sharingSettings: BacktrackSharingSettings;
}

interface BacktrackFriendStats {
  user: BacktrackFriend;
  recentlyPlayed: BacktrackRecentlyPlayedTrack[];
  artists: BacktrackTopArtist[];
  tracks: BacktrackTopTrack[];
}

interface BacktrackFriendRequest {
  friend: BacktrackFriend;
  createdAt: Date;
}

enum BacktrackSharingSettings {
  NONE,
  FRIENDS,
  ALL,
}

enum BacktrackFriendStatus {
  NONE,
  FRIENDS,
  REQUEST_INCOMING,
  REQUEST_OUTGOING,
}
