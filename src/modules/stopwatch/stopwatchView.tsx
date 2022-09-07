import { useAutoRerender } from '@common/useAutoRerender.hook';
import { TimeDisplay } from '@modules/timeDisplay/timeDisplay';
import { useStopwatch } from './useStopwatch.hook';

const StopwatchView = () => {
  const { time, status } = useStopwatch();
  useAutoRerender({ every: 10, isRunning: status === 'running' });

  return <TimeDisplay time={time} withMills />;
};

export { StopwatchView };
