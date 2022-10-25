import { getTimerDetails } from '@modules/timer/getTimerDetails.util';
import { TimerState, TimerStep } from '@typings/timer';
import { autoId } from '@utils/autoId.util';
import { getTime } from '@utils/getTime.util';

export {};

let timeouts: { id: string; timeout: NodeJS.Timeout }[] = [];

const addTimeout = (f: () => void, time: number) => {
  const id = autoId();
  timeouts.push({
    id,
    timeout: setTimeout(() => {
      f();

      const index = timeouts.findIndex((e) => e.id === id);
      if (index >= 0) {
        const cloned = timeouts.slice();
        cloned.splice(index, 1);
        timeouts = cloned;
      }
    }, time),
  });
};

const resetTimeouts = () => {
  timeouts.forEach(({ timeout }) => {
    clearTimeout(timeout);
  });

  timeouts = [];
};

addEventListener('message', (e: MessageEvent<TimerState>) => {
  if (!e.data) return;
  const state = e.data;
  const { steps } = state;

  resetTimeouts();

  const now = getTime();
  const { ranTime, status } = getTimerDetails({ ...state, now });

  console.log('worker', status);

  if (status === 'running') {
    let agTime = 0;
    steps.forEach((step, i) => {
      agTime += step.time;

      const stepRanTime = agTime - ranTime;

      if (stepRanTime > 0) {
        addTimeout(() => {
          if (i === steps.length - 1) postMessage('finished_timer');
          else postMessage('finished_step');
        }, stepRanTime);
      }
    });
  }
});
