type ToasterType = 'success' | 'error';

export type ToasterOptions = {
  type: string;
  message: string;
  duration?: number;
};
