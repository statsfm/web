export type User = {
  id: string;
  displayName: string;
  disabled: boolean;
  email: string;
  image: string;
  country: string;
  product: string;
  userSettingsId: string;
  apiClientId: string;
  isPlus: boolean;
  synEnabled: boolean;
  shareSettings: string;
  streamsIndex: number;
  settings: {
    id: string;
    accessToken: string;
  };
};
