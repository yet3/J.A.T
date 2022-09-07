import { TimerStatus, TimerStep } from '@typings/timer';
import { getTime } from '@utils/getTime.util';

interface Data {
  startedAt: number;
  pausedAt: number;
  steps: TimerStep[];
  now?: number;
}

const getTimerDetails = (data: Data) => {
  const { startedAt, pausedAt, steps, now = getTime() } = data;

  const totalTime = steps.reduce((total, step) => total + step.time, 0);

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
    }
    elapsedTime = now - startedAt;
    ranTime = elapsedTime - elapsedPausedTime;

    if (ranTime >= totalTime) status = 'finished';
    else if (!pausedAt) status = 'running';
  }

  return { status, hasStarted: status !== 'idle', totalTime, elapsedPausedTime, ranTime, pausedTime, elapsedTime };
};

export { getTimerDetails };
