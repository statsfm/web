import { type Props } from 'react-apexcharts';
import type * as statsfm from '@statsfm/statsfm.js';

export const listeningClockTimes = [
  '00:00 - 01:00',
  '01:00 - 02:00',
  '02:00 - 03:00',
  '03:00 - 04:00',
  '04:00 - 05:00',
  '05:00 - 06:00',
  '06:00 - 07:00',
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
  '22:00 - 23:00',
  '23:00 - 00:00',
];

export const clockProps = (
  dateStats: Record<number, statsfm.StreamStats>,
  type: 'minutes' | 'streams'
): Props => ({
  type: 'polarArea',
  series:
    type === 'minutes'
      ? Object.values(dateStats).map((stat) => stat.durationMs)
      : Object.values(dateStats).map((stat) => stat.count),
  options: {
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 0,
        },
        spokes: {
          strokeWidth: 1,
        },
      },
    },
    chart: {
      type: 'polarArea',
      animations: {
        enabled: false,
      },
    },
    legend: { show: false },
    labels: listeningClockTimes,
    colors: ['#1ed760'],
    stroke: {
      colors: ['#111112'],
      width: 2,
    },
    fill: {
      opacity: 1,
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      custom: ({ w, seriesIndex }) => {
        const timeRange = w.config.labels[seriesIndex] as string;
        const amount = w.config.series[seriesIndex] as number;
        if (type === 'minutes') {
          const minutes = Math.floor(amount / 1000 / 60);
          const hours = Math.floor(minutes / 60);
          const minutesLeft = minutes % 60;
          return `${timeRange}: ${hours}h ${minutesLeft}m`;
        }
        return `${timeRange}: ${amount.toLocaleString()} ${
          amount === 1 ? type.slice(0, -1) : type
        }`;
      },
    },
  },
});
