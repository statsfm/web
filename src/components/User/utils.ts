import {
  Range,
  type QueryWithDates,
  type QueryWithRange,
} from '@/utils/statsfm';
import dayjs from 'dayjs';

export const ranges: Record<BetterRange, string | null> = {
  today: 'from today',
  this_week: 'from this week',
  weeks: 'from the past 4 weeks',
  months: 'from the past 6 months',
  current_year: 'from this year',
  lifetime: '',
};

export enum BetterRange {
  TODAY = 'today',
  THIS_WEEK = 'this_week',
  WEEKS = 'weeks',
  MONTHS = 'months',
  CURRENT_YEAR = 'current_year',
  LIFETIME = 'lifetime',
}

export type TimeframeSelection = {
  range: BetterRange;
  custom?: { start: Date; end: Date };
  selected?: 'RANGE' | 'CUSTOM' | 'APPLEMUSIC';
  year?: number;
};

export const getTimeframeText = (timeframe: TimeframeSelection) => {
  if (timeframe.selected === 'CUSTOM') {
    return `from ${timeframe.custom!.start.toLocaleDateString()} to ${timeframe.custom!.end.toLocaleDateString()}`;
  }

  if (timeframe.selected === 'APPLEMUSIC') {
    return `from ${timeframe.year}`;
  }

  if (timeframe.selected === 'RANGE') {
    return ranges[timeframe.range!];
  }

  return '';
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
  if (timeframe.selected === 'RANGE') {
    if (timeframe.range === BetterRange.TODAY) {
      return {
        after: dayjs().startOf('day').valueOf(),
        before: dayjs().add(1, 'day').startOf('day').valueOf(),
      };
    }
    if (timeframe.range === BetterRange.THIS_WEEK) {
      return {
        after: dayjs().startOf('week').valueOf(),
        before: dayjs().endOf('week').valueOf(),
      };
    }
    if (timeframe.range === BetterRange.CURRENT_YEAR) {
      return {
        after: dayjs().startOf('year').valueOf(),
        before: dayjs().endOf('year').valueOf(),
      };
    }
    if (timeframe.range === BetterRange.WEEKS) {
      return {
        range: Range.WEEKS,
      };
    }

    if (timeframe.range === BetterRange.MONTHS) {
      return { range: Range.MONTHS };
    }

    return { range: Range.LIFETIME };
  }
  if (timeframe.selected === 'APPLEMUSIC') {
    return {
      range: timeframe.year as unknown as Range,
    };
  }
  return { range: Range.LIFETIME };
};

export const getTimeframeQueryParam = (timeframe: TimeframeSelection) => {
  if (timeframe.selected === 'APPLEMUSIC') {
    return `?year=${timeframe.year}`;
  }
  if (timeframe.selected === 'RANGE') {
    return `?range=${timeframe.range}`;
  }
  // TODO: handle custom
  return '';
};

export const rangeToText = (range: BetterRange) => {
  if (range === BetterRange.TODAY) {
    return 'today';
  }
  if (range === BetterRange.WEEKS) {
    return '4 weeks';
  }
  if (range === BetterRange.MONTHS) {
    return '6 months';
  }
  if (range === BetterRange.THIS_WEEK) {
    return 'this week';
  }
  if (range === BetterRange.CURRENT_YEAR) {
    return dayjs().year();
  }

  return 'lifetime';
};
