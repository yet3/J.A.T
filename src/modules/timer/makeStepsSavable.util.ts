import type { TimerSavedStep, TimerStep } from "@typings/timer"

export const makeStepsSavable = (steps: TimerStep[]): TimerSavedStep[] => {
  return steps.map((step) => ({ time: step.time, title: step.title, description: step.description }));
}
