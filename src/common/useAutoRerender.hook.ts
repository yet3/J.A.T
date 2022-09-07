import { useEffect, useState } from 'react';

interface Options {
  every: number;
  isRunning?: boolean | null;
  onlyIfVisible?: boolean;
}

const useAutoRerender = ({ every, onlyIfVisible = true, ...opts }: Options) => {
  const [running, setRunning] = useState(false);
  const [, setRerender] = useState({});

  const isRunning = opts.isRunning ?? running;

  useEffect(() => {
    if (isRunning) {
      let interval = setInterval(() => {
        setRerender({});
      }, every);

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          interval = setInterval(() => {
            setRerender({});
          }, every);
        } else {
          clearInterval(interval);
        }
      };

      if (onlyIfVisible) document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(interval);
        if (onlyIfVisible) document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [isRunning, every, onlyIfVisible]);

  return { start: () => setRunning(true), stop: () => setRunning(false) };
};

export { useAutoRerender };
