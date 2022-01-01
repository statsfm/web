import { ToasterOptions } from '~/types';
import { errors } from './state';

type ToasterOptionsWithoutType = Omit<ToasterOptions, 'type'>;

export const error = (options: ToasterOptionsWithoutType) => {
  errors.value.push({ ...options, type: 'error' });
};

export const success = (options: ToasterOptionsWithoutType) => {
  errors.value.push({ ...options, type: 'success' });
};

export const clear = () => {
  errors.value = [];
};
