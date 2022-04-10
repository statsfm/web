import { useApi } from '~/hooks';
import router from '~/router';
import { useStore } from '~/store';

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
  private readonly redirectUri: string = `${location.origin}/auth/callback`;
  private readonly api = useApi();
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
  // public getSpotifyToken = async (): Promise<string | undefined> => {
  //   const localStorageItem = localStorage.getItem('user');
  //   if (localStorageItem && !this.hasValidToken()) {
  //     return JSON.parse(localStorageItem).settings.accessToken;
  //   }

  //   const res = await this.api.http.httpGet<GetTokenResponse>('/auth/token');

  //   if (res.success) {
  //     return res.data.data.settings.accessToken;
  //   }
  // };

  public login = (redirectPage?: string) => {
    const scope = [
      // Images
      'ugc-image-upload',
      // Spotify Connect
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      // Playback
      'streaming',
      'app-remote-control',
      // Users
      'user-read-email',
      'user-read-private',
      // 'user-read-birthdate',
      // Playlists
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-read-private',
      'playlist-modify-private',
      // Library
      'user-library-modify',
      'user-library-read',
      // Listening History
      'user-top-read',
      'user-read-playback-position',
      'user-read-recently-played',
      // Follow
      'user-follow-read',
      'user-follow-modify'
    ].join('%20');
    // const loginUrl = `${ApiManager.baseUrl}/auth/redirect/spotify?scope=${scope}&redirect_uri=${this.redirectUri}`;
    const loginUrl = `https://api.stats.fm/api/v1/auth/redirect/spotify?scope=${scope}&redirect_uri=${this.redirectUri}`;

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
    this.api.http.config.accessToken = token;

    localStorage.setItem('token', token);

    const user = await this.api.me.get();
    if (user) {
      // TODO: fix types
      this.store.setUser(user as any);
    } else {
      alert('user not found: ' + JSON.stringify(user));
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

  public hasValidToken = (maxAge?: number) => {
    const token = localStorage.getItem('token');
    let valid = false;

    if (token?.startsWith('ey')) {
      const { exp, iat } = JSON.parse(atob(token!.split('.')[1]).toString()); // falsely marked as deprecated -> https://github.com/microsoft/TypeScript/issues/45566
      if (exp == undefined || exp == null) {
        valid = true;
      } else {
        valid = Math.floor(new Date().getTime() / 1000) <= exp;
      }

      if (valid && maxAge && maxAge > 0) {
        valid = Date.now() / 1000 - iat < maxAge;
      }
    }

    return valid;
  };
}
