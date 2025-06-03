import { useEffect, useState } from 'react';
import { RudderAnalytics } from '@rudderstack/analytics-js';

const useAnalytics = (): RudderAnalytics | undefined => {
  const [analytics, setAnalytics] = useState<RudderAnalytics>();

  useEffect(() => {
    if (!analytics) {
      const analyticsInstance = new RudderAnalytics();
      analyticsInstance.load(
        process.env.NEXT_PUBLIC_RUDDERSTACK_KEY,
        process.env.NEXT_PUBLIC_RUDDERSTACK_DATA_PLANE_URL,
      );
      setAnalytics(analyticsInstance);
    }
  }, [analytics]);

  return analytics;
};

export default useAnalytics;
