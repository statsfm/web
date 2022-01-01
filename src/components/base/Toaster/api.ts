import { ToasterOptions } from '~/types';
import { errors } from './state';

type ToasterOptionsWithoutType = Omit<ToasterOptions, 'type'>;

export const error = (options: ToasterOptionsWithoutType) => {
  set({ ...options, type: 'error' });
};

export const success = (options: ToasterOptionsWithoutType) => {
  set({ ...options, type: 'success' });
};

export const set = (options: ToasterOptions) => {
  errors.value.push(options);
};

export const clear = () => {
  errors.value = [];
};
