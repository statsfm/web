import type { Range } from '@statsfm/statsfm.js';

export const ranges: Record<Range, string | null> = {
  weeks: 'from the past 4 weeks',
  months: 'from the past 6 months',
  lifetime: '',
  days: null,
  today: 'from today',
};
