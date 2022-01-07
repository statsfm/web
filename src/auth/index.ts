import BacktrackApi from '~/api';
import router from '~/router';
import { useStore } from '~/store';
import { GetTokenResponse, GetUsersMeResponse } from '~/types';

const store = useStore();

export interface Response {
  success: boolean;
  status: number;
  statusText: string;
  url: string;
  headers: any;
  data: any;
}

export default class auth {
  private readonly clientId: string = '52242e73817e4096ad71500937a1fb58'; //process.env.VUE_APP_SPOTIFY_CLIENT_ID
  private readonly redirectUri: string = `${location.origin}/auth/callback`;
  private readonly api = BacktrackApi;
  private readonly store = store;

  constructor() {
    this.init();
  }

  public init = () => {
    if (this.isLoggedIn()) {
      const user = JSON.parse(localStorage.getItem('user') as string);
      this.store.setUser(user);
    }
  };

  // TODO: rewrite this function
  public getSpotifyToken = async (): Promise<string | undefined> => {
    const localStorageItem = localStorage.getItem('user');
    if (localStorageItem && !this.hasValidToken()) {
      return JSON.parse(localStorageItem).settings.accessToken;
    }

    const res = await this.api.get<GetTokenResponse>('/auth/token');

    if (res.success) {
      return res.data.data.settings.accessToken;
    }
  };

  public login = (redirectPage?: string) => {
    const scope = [
      // // Images
      // 'ugc-image-upload',
      // // Spotify Connect
      // 'user-read-playback-state',
      // 'user-modify-playback-state',
      // 'user-read-currently-playing',
      // // Playback
      // 'streaming',
      // 'app-remote-control',
      // // Users
      // 'user-read-email',
      'user-read-private'
      // 'user-read-birthdate',
      // // Playlists
      // 'playlist-read-collaborative',
      // 'playlist-modify-public',
      // 'playlist-read-private',
      // 'playlist-modify-private',
      // // Library
      // 'user-library-modify',
      // 'user-library-read',
      // // Listening History
      // 'user-top-read',
      // 'user-read-playback-position',
      // 'user-read-recently-played',
      // // Follow
      // 'user-follow-read',
      // 'user-follow-modify'
    ].join('%20');
    const loginUrl = `${this.api.baseUrl}/auth/redirect/spotify?scope=${scope}&redirect_uri=${this.redirectUri}`;

    localStorage.setItem(
      'redirectPage',
      redirectPage == 'string' ? redirectPage : location.pathname
    );

    location.replace(loginUrl);
  };

  public logout = () => {
    localStorage.removeItem('token');
    location.reload();
  };

  public setToken = async (token: string) => {
    localStorage.setItem('token', token);
    const { data } = await this.api.get<GetUsersMeResponse>('/users/me');
    if (data.item) {
      // TODO: fix types
      this.store.setUser(data.item as any);
    } else {
      alert('user not found: ' + JSON.stringify(data));
    }

    let page = localStorage.getItem('redirectPage') ?? '/';

    if (page.startsWith('/auth')) {
      page = '/';
    }

    router.push(page);
  };

  public isLoggedIn = () => {
    if (!this.hasValidToken()) return false;
    const user = localStorage.getItem('user');

    return user != null && user != undefined;
  };

  public hasValidToken = () => {
    const token = localStorage.getItem('token');
    if (token?.startsWith('ey')) {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp; // falsely marked as deprecated -> https://github.com/microsoft/TypeScript/issues/45566

      return Math.floor(new Date().getTime() / 1000) <= expiry;
    }

    return false;
  };
}
