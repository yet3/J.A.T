import { TimerStatus } from '@typings/timer';
import { getTime } from '@utils/getTime.util';

interface Data {
  startedAt: number;
  pausedAt: number;
  now?: number;
}

const getStopwatchDetails = (data: Data) => {
  const { startedAt, pausedAt, now = getTime() } = data;

  // For how long it's been running
  let ranTime = 0;
  // Total time since it started
  let elapsedTime = 0;
  // Total time since it's been paused
  let elapsedPausedTime = 0;
  // For how long it's been paused
  let pausedTime = 0;

  let status: TimerStatus = 'idle';

  if (startedAt) {
    if (pausedAt) {
      status = 'paused';
      elapsedPausedTime = now - pausedAt;
      pausedTime = pausedAt - startedAt;
    } else status = 'running';

    elapsedTime = now - startedAt;
    ranTime = elapsedTime - elapsedPausedTime;
  }

  return { status, hasStarted: status !== 'idle', elapsedPausedTime, ranTime, pausedTime, elapsedTime };
};

export { getStopwatchDetails };
