// TODO: fix dependency cycle
// eslint-disable-next-line import/no-cycle
import { useApi } from '@/hooks';
import type * as statsfm from '@statsfm/statsfm.js';
import { decodeJwt } from 'jose';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  const login = (redirectUrl?: string) => {
    if (redirectUrl) Cookies.set('redirectUrl', redirectUrl);
    router.push('/api/auth/login');
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
    Cookies.set('redirectUrl', router.asPath);
    router.push('/api/auth/logout');
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
