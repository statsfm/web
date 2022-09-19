// TODO: fix dependency cycle
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/hooks';
import type * as statsfm from '@statsfm/statsfm.js';
import { decodeJwt } from 'jose';
import type { PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext<{
  user: statsfm.UserPrivate | null;
  updateUser: (user: statsfm.UserPrivate) => void;
  tokenAge: () => number | null;
  login: (redirectUrl?: string) => void;
  logout: () => void;
  callback: (token: string) => void;
} | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<statsfm.UserPrivate | null>(null);
  const [token, setToken] = useState<string>();

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

    if (redirectUrl) localStorage.setItem('redirectUrl', redirectUrl);

    // eslint-disable-next-line no-restricted-globals
    location.replace(
      // eslint-disable-next-line no-restricted-globals
      `https://api.stats.fm/api/v1/auth/redirect/spotify?scope=${scope}&redirect_uri=${location.origin}/auth/callback`
    );
  };

  const tokenAge = () => {
    const token = localStorage.getItem('token') || '';
    const { iat, exp } = decodeJwt(token);

    let valid = false;

    if (!iat) return null;
    if (!exp) valid = true;
    else valid = Math.floor(new Date().getTime() / 1000) <= exp;

    return valid ? Date.now() / 1000 - iat : null;
  };

  const updateUser = (user: statsfm.UserPrivate) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // call this function on callback of an oauth callback
  const callback = async (token: string) => {
    setToken(token);
  };

  // set the token from localstorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setToken(token);
  }, []);

  // set the token and fetch the user signed in with the token
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      api.http.config.accessToken = token;

      (async () => {
        setUser(await api.me.get());
      })();
    }
  }, [token]);

  const exposed = {
    tokenAge,
    user,
    updateUser,
    login,
    logout,
    callback,
    token,
  };

  return (
    <AuthContext.Provider value={exposed}>{children}</AuthContext.Provider>
  );
};
