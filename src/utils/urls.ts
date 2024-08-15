export const isFacebookURL = (url: string): boolean =>
  url.includes('fbcdn') || url.includes('fbsbx');
