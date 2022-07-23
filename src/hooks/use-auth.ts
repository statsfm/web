import { useContext } from 'react';
// TODO: fix dependency cycle
// eslint-disable-next-line import/no-cycle
import { AuthContext } from '@/context/auth';

export const useAuth = () => useContext(AuthContext)!;
