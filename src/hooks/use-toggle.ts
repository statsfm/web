import { useState } from 'react';

export const useToggle = (defaultState = false) => {
  const [state, setState] = useState(defaultState);

  const off = () => {
    setState(false);
  };

  const on = () => {
    setState(true);
  };

  const toggle = () => {
    setState(!state);
  };

  return {
    state,
    on,
    off,
    toggle,
  };
};
