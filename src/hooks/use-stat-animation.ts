import type { DatabaseSizeItem } from '@statsfm/statsfm.js';
import { useState, useEffect } from 'react';

// rerender time in ms
const timeUnit = 50;

const animationDuration = 3000; // in ms
const frameDuration = 1000 / 60; // frames in a second if we want 60 frames per second
const totalFrames = Math.round(animationDuration / frameDuration);
// An ease-out function that slows the count as it progresses
const easeOutQuad = (x: number) => (x === 1 ? 1 : 1 - 10 ** (-10 * x));

export const useStatAnimation = (snapshot: DatabaseSizeItem) => {
  const [count, setCount] = useState(snapshot.current.count);
  const [indicator, setIndicator] = useState(0);

  useEffect(() => {
    // diff between the 2 snapshots in ms
    const timeDiff =
      new Date(snapshot.current.date).getTime() -
      new Date(snapshot.previous.date).getTime();

    // diffs between the 2 snapshots
    const countDiff = snapshot.current.count - snapshot.previous.count;
    const countDiffPerTimeUnit = countDiff / (timeDiff / timeUnit);

    // offset since latest snapshot in timeUnits
    const epochOffset =
      (Date.now() - new Date(snapshot.current.date).getTime()) / timeUnit;

    // set initial values;
    setCount(count + epochOffset * countDiffPerTimeUnit);
    setIndicator(countDiffPerTimeUnit * ((60 * 60 * 1000) / timeUnit));

    let postAnimationInterval: NodeJS.Timer;
    const startCounting = () => {
      postAnimationInterval = setInterval(() => {
        setCount((count) => count + countDiffPerTimeUnit);
      }, timeUnit);
    };

    const animationInterval = (() => {
      let frame = 0;
      const countTo = count + epochOffset * countDiffPerTimeUnit;

      const counter = setInterval(() => {
        frame += 1;
        const progress = easeOutQuad(frame / totalFrames);
        setCount(Math.round(countTo * progress));

        if (frame === totalFrames) {
          clearInterval(counter);
          startCounting();
        }
      }, frameDuration);

      return counter;
    })();

    return () => {
      clearInterval(animationInterval);
      clearInterval(postAnimationInterval);
    };
  }, []);

  return { count, indicator };
};
