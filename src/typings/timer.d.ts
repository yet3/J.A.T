import { Dispatch } from 'react';

export interface TimerStep {
  id: string;
  time: number;
  title: string;
  description: string;
}

export type TimerMode = 'timer' | 'editor';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface TimerState {
  mode: TimerMode;
  startedAt: number;
  pausedAt: number;
  steps: TimerStep[];

  hasInitialized: boolean;
  saveId: string | null;
}

export type TimerSavedStep = Omit<TimerStep, 'id'>;
export interface TimerAutoSave {
  mode: TimerMode;
  startedAt: number;
  pausedAt: number;
  steps: TimerSavedStep[];

  savedAt: Date;
}

export interface SavedTimer {
  id: string;
  title: string;
  steps: TimerSavedStep[];
  savedAt: Date;
}

export type TimerActions =
  | Action<'init'>
  | Action<'setTimer', Partial<TimerState>>
  | Action<'start', { forced?: boolean }>
  | Action<'pause'>
  | Action<'reset'>
  | Action<'nextStep', { currentStepId: string }>
  | Action<'previousStep', { currentStepId: string }>
  | Action<'setMode', { mode: TimerMode }>
  | Action<'addStep'>
  | Action<'deleteStep', { id: string }>
  | Action<'moveStep', { oldId: string; newId: string }>
  | Action<'setStepTime', { id: string; time: number }>
  | Action<'setStepTitle', { id: string; value: string }>
  | Action<'setStepDescription', { id: string; value: string }>
  | Action<'clear'>;

export type ITimerContext = {
  state: TimerState;
  dispatch: Dispatch<TimerActions>;
} | null;
