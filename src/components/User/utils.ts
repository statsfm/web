import {
  Range,
  type QueryWithDates,
  type QueryWithRange,
} from '@statsfm/statsfm.js';

export const ranges: Record<Range, string | null> = {
  weeks: 'from the past 4 weeks',
  months: 'from the past 6 months',
  lifetime: '',
  days: null,
  today: 'from today',
};

export type TimeframeSelection = {
  range?: Range;
  custom?: { start: Date; end: Date };
  selected?: 'RANGE' | 'CUSTOM';
};

export const getTimeframeText = (timeframe: TimeframeSelection) => {
  if (timeframe.selected === 'CUSTOM' && timeframe.range === Range.TODAY) {
    return ranges[timeframe.range!];
  }
  if (timeframe.selected === 'CUSTOM') {
    return `from ${timeframe.custom!.start.toLocaleDateString()} to ${timeframe.custom!.end.toLocaleDateString()}`;
  }

  return ranges[timeframe.range!];
};

export const getTimeframeOptions = (
  timeframe: TimeframeSelection
): QueryWithDates | QueryWithRange => {
  if (timeframe.selected === 'CUSTOM') {
    return {
      after: timeframe.custom!.start.getTime(),
      before: timeframe.custom!.end.getTime(),
    };
  }

  return {
    range: timeframe.range,
  };
};
