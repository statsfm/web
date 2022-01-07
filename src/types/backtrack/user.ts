import { BacktrackSharingSettings } from '../index';

export interface BacktrackUser<IncludeSettings = false, IncludeApiClient = false> {
  id: string;
  displayName: string;
  disabled: boolean;
  email: string;
  image?: string;
  country?: string;
  product: string;
  userSettingsId: string;
  apiClientId: string;
  isPlus: boolean;
  syncEnabled: boolean;
  shareSettings: BacktrackSharingSettings;
  streamsIndex: number;
  settings: IncludeSettings extends true
    ? {
        id: number;
        refreshToken?: string;
        accessToken: string;
        accessTokenExpiration: Date;
      }
    : never;
  apiClient: IncludeApiClient extends true
    ? {
        id: string;
        secret: string;
        count: number;
      }
    : never;
}
