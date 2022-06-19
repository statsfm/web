const baseTitle = 'Stats.fm (formerly Spotistats for Spotify)';

export const useTitle = (title?: string) => {
  document.title = title ? `${title} | ${baseTitle}` : baseTitle;
};
