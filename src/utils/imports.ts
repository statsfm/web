export const IMPORT_STATUS = {
  '-1': 'Errored!',
  '0': 'Queued (waiting to be processed)',
  '1': 'Processing',
  '2': 'Successfully processed',
} as const;

export const IMPORT_STATUS_COLORS = {
  '2': 'text-green-400 ring-green-400/30',
  '1': 'text-gray-400 ring-gray-400/30',
  '0': 'text-yellow-400 ring-yellow-400/30',
  '-1': 'text-red-400 ring-red-400/30',
} as const;

export function getOrdinal(n: number) {
  let ord = 'th';

  if (n % 10 === 1 && n % 100 !== 11) {
    ord = 'st';
  } else if (n % 10 === 2 && n % 100 !== 12) {
    ord = 'nd';
  } else if (n % 10 === 3 && n % 100 !== 13) {
    ord = 'rd';
  }

  return ord;
}

export const MONTHS = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function getMonthName(month: number) {
  return MONTHS[month];
}
