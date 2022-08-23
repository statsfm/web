import type { Dispatch } from 'react';
import { createContext, useContext } from 'react';
import type { Action, StateDefinition } from './MenuRoot';

export const MenuContext = createContext<
  [StateDefinition, Dispatch<Action>] | null
>(null);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('missing parent <Menu /> component.');
  return context;
};
