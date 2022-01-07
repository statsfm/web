import { BacktrackTrack } from './backtrack';
import {
  BacktrackArtist,
  BacktrackFriend,
  BacktrackGenre,
  BacktrackRecentlyPlayedTrack,
  BacktrackTopAlbum,
  BacktrackTopArtist,
  BacktrackUserImport,
  GiftCode,
  TotalSize,
  BacktrackUser
} from './index';

export interface GetUsersMeResponse {
  item: Pick<
    BacktrackUser,
    'id' | 'displayName' | 'image' | 'country' | 'isPlus' | 'shareSettings'
  >;
}

export interface GetTokenResponse {
  data: Pick<BacktrackUser<true, true>, 'settings' | 'apiClient'>;
}

export type PostImportRemoveResponse = [number, number];

export interface GetStatsDatabaseSiteResponse {
  items: TotalSize;
}

export interface GetArtistResponse {
  item: BacktrackArtist;
}

export interface GetStreamArtistCountResponse {
  data: number;
}
export interface GetStreamArtistDurationResponse {
  data: number;
}

export interface GetGenreResponse {
  item: BacktrackGenre;
}

export interface GetFriendResponse {
  data: BacktrackFriend;
}

export interface GetFriendStatsResponse {
  data: {
    recentlyPlayed: BacktrackRecentlyPlayedTrack[];
    artists: BacktrackTopArtist[];
    tracks: BacktrackTopAlbum[];
  };
}

export interface GetUserTopArtistsShortTermResponse {
  items: BacktrackTopArtist[];
}

export interface GetPlusGiftCodeResponse {
  item: GiftCode;
}

export interface PutPlusGiftCodeResponse {
  item: GiftCode;
  message?: string;
}

export interface PostImportCodeResponse {
  message?: string;
  data: BacktrackUser;
}

export interface PostPlusGiftCodeRedeemResponse {
  message?: string;
  item: GiftCode;
}

export interface PostImportUploadResponse {
  message?: string;
  data: {
    message: string;
    imports: BacktrackUserImport[];
    user: BacktrackUser;
  };
}

export interface GetImportListResponse {
  items: BacktrackUserImport[];
}

export interface GetPlusGiftCodeListResponse {
  items: GiftCode[];
}

export interface GetPlusGiftCodePurcahseResponse {
  // take a look at the stripe documentation for this, `<Stripe>.ceckout.session.create`
  item: {
    [key: string]: any;
    url: string;
  };
}

export interface GetTrackResponsive {
  item: BacktrackTrack;
}
