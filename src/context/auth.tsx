// TODO: fix dependency cycle
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/hooks';
import type * as statsfm from '@statsfm/statsfm.js';
import { decodeJwt } from 'jose';
import Cookies from 'js-cookie';
import type { PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext<{
  user: statsfm.UserPrivate | null;
  updateUser: (user: statsfm.UserPrivate) => void;
  tokenAge: () => number | null;
  login: (redirectUrl?: string) => void;
  logout: () => void;
} | null>(null);

export const AuthProvider = (
  props: PropsWithChildren<{ user?: statsfm.UserPrivate }>
) => {
  const [user, setUser] = useState<statsfm.UserPrivate | null>(
    props.user ?? null
  );
  const api = useApi();

  const login = (redirectUrl?: string) => {
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
      'user-follow-modify',
    ].join('%20');

    if (redirectUrl) Cookies.set('redirectUrl', redirectUrl);

    // eslint-disable-next-line no-restricted-globals
    location.replace(
      // eslint-disable-next-line no-restricted-globals
      `https://api.stats.fm/api/v1/auth/redirect/spotify?scope=${scope}&redirect_uri=${location.origin}/api/auth/callback`
    );
  };

  const tokenAge = () => {
    const token = Cookies.get('identityToken');
    try {
      const { iat, exp } = decodeJwt(token!);

      let valid = false;

      if (!iat) return null;
      if (!exp) valid = true;
      else valid = Math.floor(new Date().getTime() / 1000) <= exp;

      return valid ? Date.now() / 1000 - iat : null;
    } catch (err) {
      return null;
    }
  };

  const updateUser = (user: statsfm.UserPrivate) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('identityToken', {
      domain: '.stats.fm',
      path: '/',
      secure: true,
    });
  };

  useEffect(() => {
    // remove deprecated token from localstorage;
    localStorage.removeItem('token');

    // set token
    const token = Cookies.get('identityToken');
    if (!token) return;
    api.http.config.accessToken = token;

    // hydrate the user on the frontend if not provided by gssp
    if (user) return;
    (async () => {
      setUser(await api.me.get());
    })();
  }, []);

  const exposed = {
    tokenAge,
    user,
    updateUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={exposed}>
      {props.children}
    </AuthContext.Provider>
  );
};
