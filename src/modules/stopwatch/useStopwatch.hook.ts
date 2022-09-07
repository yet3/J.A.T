import { getTime } from '@utils/getTime.util';
import { useContext } from 'react';
import { getStopwatchDetails } from './getStopwatchDetails.util';
import { StopwatchContext } from './stopwatch.context';

const useStopwatch = () => {
  const context = useContext(StopwatchContext);

  if (!context) {
    throw Error('useStopwatch: StopwatchContext is not defined');
  }

  const { state, dispatch } = context;

  const start = () => dispatch({ type: 'start' });
  const pause = () => dispatch({ type: 'pause' });
  const reset = () => dispatch({ type: 'reset' });
  const lap = () => dispatch({ type: 'lap' });

  const now = getTime();
  const { status, ranTime } = getStopwatchDetails({ ...state, now });

  return {
    status,
    time: ranTime,
    laps: state.laps,
    hasInitialized: state.hasInitialized,
    actions: {
      start,
      pause,
      reset,
      lap
    },
  };
};

export { useStopwatch };
