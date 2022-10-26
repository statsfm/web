import dayjs from 'dayjs';

const locale = 'eu';
const numberFormatter = Intl.NumberFormat(locale, { notation: 'compact' });

function nounify(text: string) {
  if (text.endsWith('s')) return `${text}'`;
  return `${text}'s`;
}

function pluralise(text: string, amount: number) {
  return amount === 1 ? text : `${text}s`;
}

function localiseNumber(num: number, localeOverwrite?: string) {
  return num.toLocaleString(localeOverwrite || locale);
}

function formatNumberCompact(num: number) {
  return numberFormatter.format(num);
}

function formatMinutes(ms: number) {
  const mins = Math.floor(dayjs.duration(ms, 'ms').asMinutes());
  return localiseNumber(mins);
}

const exposed = {
  nounify,
  pluralise,
  localiseNumber,
  formatNumberCompact,
  formatMinutes,
};

export default exposed;
