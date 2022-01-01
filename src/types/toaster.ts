type ToasterType = 'success' | 'error';

export type ToasterOptions = {
  type: ToasterType;
  message: string;
  duration?: number;
};
