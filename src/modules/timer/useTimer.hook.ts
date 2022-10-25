import { TimerMode, TimerState, TimerStep } from '@typings/timer';
import { getTime } from '@utils/getTime.util';
import { useContext } from 'react';
import { getTimerDetails } from './getTimerDetails.util';
import { TimerContext } from './timer.context';

const useTimer = () => {
  const context = useContext(TimerContext);

  if (!context) {
    throw Error('useTimer: TimerContext is not defined');
  }

  const { state, dispatch } = context;

  const setTimer = (state: Partial<TimerState>) => dispatch({ type: 'setTimer', payload: state });
  const setMode = (mode: TimerMode) => dispatch({ type: 'setMode', payload: { mode } });
  const start = (forced: boolean = false) => dispatch({ type: 'start', payload: { forced } });
  const pause = () => dispatch({ type: 'pause' });
  const reset = () => dispatch({ type: 'reset' });
  const addStep = () => dispatch({ type: 'addStep' });
  const moveStep = (oldId: string, newId: string) => dispatch({ type: 'moveStep', payload: { oldId, newId } });
  const clear = () => dispatch({ type: 'clear' });
  const nextStep = () => {
    if (currentStep) {
      dispatch({ type: 'nextStep', payload: { currentStepId: currentStep.id } });
    }
  };
  const previousStep = () => {
    if (currentStep) {
      dispatch({ type: 'previousStep', payload: { currentStepId: currentStep.id } });
    }
  };

  const now = getTime();
  const { status, totalTime, ranTime } = getTimerDetails({ ...state, now });
  const time = Math.max(0, totalTime - ranTime);

  const amtOfSteps = state.steps.length;
  let currentStep: TimerStep | null = null;
  let currentStepIndex: number = 0;
  let ranTimeAt = 0;
  for (let i = 0; i < amtOfSteps; i++) {
    const step = state.steps[i];
    if (ranTime >= ranTimeAt && (ranTime < ranTimeAt + step.time || i === amtOfSteps - 1)) {
      currentStepIndex = i;
      currentStep = step;
      break;
    } else ranTimeAt += step.time;
  }

  return {
    amtOfSteps,
    currentStep,
    currentStepIndex,
    mode: state.mode,
    status,
    totalTime,
    startedAt: state.startedAt,
    pausedAt: state.pausedAt,
    ranTime,
    time,
    saveId: state.saveId,
    hasInitialized: state.hasInitialized,
    steps: state.steps,
    actions: {
      setMode,
      clear,
      addStep,
      moveStep,
      start,
      pause,
      reset,
      nextStep,
      previousStep,
      setTimer
    },
  };
};

export { useTimer };
