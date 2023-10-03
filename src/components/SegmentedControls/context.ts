import type { RefObject } from 'react';
import { createContext, useContext } from 'react';

export type Segment = {
  id: string;
  value: string;
  disabled?: boolean;
  ref: RefObject<HTMLLIElement>;
};

export interface SegmentedControlsContextProps {
  register: (segment: Segment) => void;
  unregister: (id: string) => void;
  highlight: (id: string) => {
    onMouseOver: () => void;
    onMouseLeave: () => void;
  };
  set: (id: string, initial?: boolean) => void;
  active: string | undefined;
}

export const SegmentedControlsContext =
  createContext<SegmentedControlsContextProps>({
    register() {},
    unregister() {},
    highlight() {
      return {
        onMouseOver() {},
        onMouseLeave() {},
      };
    },
    set() {},
    active: undefined,
  });

export const useSegmentedControlsContext = () =>
  useContext(SegmentedControlsContext);
