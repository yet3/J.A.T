import { ITimerContext, TimerActions, TimerAutoSave, TimerState, TimerStep } from '@typings/timer';
import { arrayMove } from '@dnd-kit/sortable';
import { autoId } from '@utils/autoId.util';
import { getTime } from '@utils/getTime.util';
import { createContext, ReactNode, Reducer, useEffect, useReducer } from 'react';
import { getTimerDetails } from './getTimerDetails.util';
import { makeStepsSavable } from './makeStepsSavable.util';

let autoSaveTimeout: null | NodeJS.Timeout = null;

const saveState = (d: (() => TimerState) | TimerState): TimerState => {
  const state = typeof d === 'function' ? d() : d;
  if (typeof window === 'undefined') return state;

  if (autoSaveTimeout != null) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }

  autoSaveTimeout = setTimeout(() => {
    console.log('timer auto saved');
    window.localStorage.setItem(
      'timerAutoSave',
      JSON.stringify({
        mode: state.mode,
        startedAt: state.startedAt,
        pausedAt: state.pausedAt,
        steps: makeStepsSavable(state.steps),
      } as TimerAutoSave)
    );

    autoSaveTimeout = null;
  }, 300);

  return state;
};

const initialState: TimerState = {
  mode: 'editor',
  startedAt: 0,
  pausedAt: 0,
  steps: [
    {
      id: autoId(),
      time: 5 * 1000,
      title: '',
      description: '',
    },
  ],
  saveId: null,
  hasInitialized: false,
};

const setStepProperties = (state: TimerState, id: string, properties: Partial<TimerStep>): TimerStep[] => {
  const stepIndex = state.steps.findIndex((s) => s.id === id);
  if (stepIndex < 0) return state.steps;
  const steps = state.steps.slice();

  steps[stepIndex] = {
    ...steps[stepIndex],
    ...properties,
  };

  return steps;
};

const reducer: Reducer<TimerState, TimerActions> = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'init': {
      if (typeof window === 'undefined' || state.hasInitialized) return state;

      const savedStateJSON = window.localStorage.getItem('timerAutoSave');
      if (savedStateJSON) {
        const { mode, startedAt, pausedAt, steps } = JSON.parse(savedStateJSON) as TimerAutoSave;
        return {
          ...initialState,
          hasInitialized: true,
          mode,
          startedAt,
          pausedAt,
          steps: steps.map((savedStep) => ({ ...savedStep, id: autoId() })),
        };
      }

      return {
        ...initialState,
        hasInitialized: true,
      };
    }
    case 'setTimer': {
      return saveState({ ...state, ...payload });
    }
    case 'setMode': {
      return saveState({ ...state, mode: payload.mode });
    }
    case 'start': {
      if (state.steps.length === 0) return state;

      if (payload.forced) {
        return saveState({ ...state, startedAt: getTime(), pausedAt: 0 });
      }

      const now = getTime();
      const { status, ranTime } = getTimerDetails({ ...state, now });

      if (status === 'paused') {
        return saveState({ ...state, startedAt: now - ranTime, pausedAt: 0 });
      }
      if (status === 'running') return state;

      return saveState({ ...state, startedAt: now });
    }
    case 'pause': {
      if (state.pausedAt || !state.startedAt || state.steps.length === 0) return state;
      return saveState({ ...state, pausedAt: getTime() });
    }
    case 'reset': {
      return saveState({ ...state, startedAt: 0, pausedAt: 0 });
    }
    case 'addStep': {
      const steps = state.steps.slice();
      steps.push({
        id: autoId(),
        time: 5 * 1000,
        title: '',
        description: '',
      });
      return saveState({ ...state, steps });
    }
    case 'deleteStep': {
      const stepIndex = state.steps.findIndex((s) => s.id === payload.id);
      if (stepIndex < 0) return state;

      const steps = state.steps.slice();
      steps.splice(stepIndex, 1);

      return saveState({ ...state, steps });
    }
    case 'moveStep': {
      const oldStepIndex = state.steps.findIndex((s) => s.id === payload.oldId);
      if (oldStepIndex < 0) return state;

      const newStepIndex = state.steps.findIndex((s) => s.id === payload.newId);
      if (newStepIndex < 0) return state;

      return saveState({ ...state, steps: arrayMove(state.steps, oldStepIndex, newStepIndex) });
    }
    case 'nextStep': {
      const currentStepIndex = state.steps.findIndex((s) => s.id === payload.currentStepId);
      if (currentStepIndex < 0) return state;

      const n = state.steps.reduce((total, step, i) => {
        if (i > currentStepIndex) return total;

        return total + step.time;
      }, 0);

      return { ...state, pausedAt: 0, startedAt: getTime() - n };
    }
    case 'previousStep': {
      const currentStepIndex = state.steps.findIndex((s) => s.id === payload.currentStepId);
      if (currentStepIndex < 0) return state;

      const n = state.steps.reduce((total, step, i) => {
        if (i > currentStepIndex - 2) return total;

        return total + step.time;
      }, 0);

      return { ...state, pausedAt: 0, startedAt: getTime() - n };
    }
    case 'setStepTime': {
      return saveState({ ...state, steps: setStepProperties(state, payload.id, { time: payload.time }) });
    }
    case 'setStepTitle': {
      return saveState({ ...state, steps: setStepProperties(state, payload.id, { title: payload.value }) });
    }
    case 'setStepDescription': {
      return saveState({ ...state, steps: setStepProperties(state, payload.id, { description: payload.value }) });
    }
    case 'clear': {
      return saveState({ ...initialState, hasInitialized: true });
    }
    default: {
      throw Error(`TimerContext reducer got called with unknown type: ${type}`);
    }
  }
};

export const TimerContext = createContext<ITimerContext>(null);
const Provider = TimerContext.Provider;

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.hasInitialized) {
      dispatch({ type: 'init' });
    }
  }, []);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
