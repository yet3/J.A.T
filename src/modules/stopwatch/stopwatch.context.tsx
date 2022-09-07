import { IStopwatchContext, StopwatchActions, StopwatchAutoSave, StopwatchState } from '@typings/stopwatch';
import { autoId } from '@utils/autoId.util';
import { getTime } from '@utils/getTime.util';
import { ReactNode, Reducer, useEffect, useReducer, createContext } from 'react';
import { getStopwatchDetails } from './getStopwatchDetails.util';

let autoSaveTimeout: null | NodeJS.Timeout = null;

const saveState = (d: (() => StopwatchState) | StopwatchState): StopwatchState => {
  const state = typeof d === 'function' ? d() : d;
  if (typeof window === 'undefined') return state;

  if (autoSaveTimeout != null) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }

  autoSaveTimeout = setTimeout(() => {
    console.log('timer auto saved');
    window.localStorage.setItem(
      'stopwatchAutoSave',
      JSON.stringify({
        startedAt: state.startedAt,
        pausedAt: state.pausedAt,
        laps: state.laps.map((l) => ({ createdAt: l.createdAt, ranTime: l.ranTime })),
      } as StopwatchAutoSave)
    );

    autoSaveTimeout = null;
  }, 300);

  return state;
};

const initialState: StopwatchState = {
  startedAt: 0,
  pausedAt: 0,
  laps: [],
  hasInitialized: false,
};

const reducer: Reducer<StopwatchState, StopwatchActions> = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'init': {
      if (typeof window === 'undefined' || state.hasInitialized) return state;

      const savedStateJSON = window.localStorage.getItem('stopwatchAutoSave');
      if (savedStateJSON) {
        const { laps, startedAt, pausedAt } = JSON.parse(savedStateJSON) as StopwatchAutoSave;
        return {
          ...initialState,
          hasInitialized: true,
          startedAt,
          pausedAt,
          laps: laps.map((l) => ({ id: autoId(), createdAt: l.createdAt, ranTime: l.ranTime })),
        };
      }

      return {
        ...initialState,
        hasInitialized: true,
      };
    }
    case 'start': {
      const now = getTime();
      const { status, ranTime } = getStopwatchDetails({ ...state, now });

      if (status === 'paused') {
        return saveState({ ...state, startedAt: now - ranTime, pausedAt: 0 });
      }
      if (status === 'running') return state;

      return saveState({ ...state, startedAt: now });
    }
    case 'pause': {
      if (state.pausedAt || !state.startedAt) return state;
      return saveState({ ...state, pausedAt: getTime() });
    }
    case 'reset': {
      return saveState({ ...initialState, hasInitialized: true });
    }
    case 'lap': {
      const laps = state.laps.slice();
      const now = getTime();
      const { ranTime } = getStopwatchDetails({ ...state, now });

      const previousCreatedAt = laps[0]?.createdAt || 0;

      if (previousCreatedAt !== ranTime || laps.length === 0) {
        laps.unshift({
          id: autoId(),
          createdAt: ranTime,
          ranTime: ranTime - previousCreatedAt,
        });
      }

      return { ...state, laps };
    }
    default: {
      throw Error(`StopwatchContext reducer got called with unknown type: ${type}`);
    }
  }
};

export const StopwatchContext = createContext<IStopwatchContext>(null);
const Provider = StopwatchContext.Provider;

export const StopwatchProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!state.hasInitialized) {
      dispatch({ type: 'init' });
    }
  }, []);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};
