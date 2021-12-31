import { BacktrackTopArtist } from './artist';
import { BacktrackRecentlyPlayedTrack, BacktrackTopTrack } from './track';

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
