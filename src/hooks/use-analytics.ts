import { useEffect, useState } from 'react';
import { RudderAnalytics } from '@rudderstack/analytics-js';

const hasEnv =
  process.env.NEXT_PUBLIC_RUDDERSTACK_KEY &&
  process.env.NEXT_PUBLIC_RUDDERSTACK_DATA_PLANE_URL;

const useAnalytics = (): {
  rudder: RudderAnalytics | undefined;
  googleAnalytics: (name: string, value?: string) => void | undefined;
} => {
  const [analytics, setAnalytics] = useState<RudderAnalytics>();

  useEffect(() => {
    if (!analytics && hasEnv) {
      const analyticsInstance = new RudderAnalytics();
      analyticsInstance.load(
        process.env.NEXT_PUBLIC_RUDDERSTACK_KEY,
        process.env.NEXT_PUBLIC_RUDDERSTACK_DATA_PLANE_URL,
      );
      setAnalytics(analyticsInstance);
    }
  }, [analytics]);

  return {
    rudder: analytics,
    googleAnalytics: (name: string, value?: string) => {
      (window as any)?.gtag?.('event', name, { value: value ?? 'success' });
    },
  };
};

export default useAnalytics;
