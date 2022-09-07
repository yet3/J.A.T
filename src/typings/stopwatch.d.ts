import { Dispatch } from 'react';

export interface StopwatchLap {
  id: string;
  createdAt: number;
  ranTime: number;
}

export interface StopwatchState {
  startedAt: number;
  pausedAt: number;
  laps: StopwatchLap[];
  hasInitialized: boolean;
}

export type StopwatchStatus = 'idle' | 'running' | 'paused';

export type StopwatchSavedLap = Omit<StopwatchLap, 'id'>;
export interface StopwatchAutoSave {
  startedAt: number;
  pausedAt: number;
  laps: StopwatchSavedLap[];
}

export type StopwatchActions = Action<'init'> | Action<'start'> | Action<'pause'> | Action<'reset'> | Action<'lap'>;

export type IStopwatchContext = {
  state: StopwatchState;
  dispatch: Dispatch<StopwatchActions>;
} | null;
