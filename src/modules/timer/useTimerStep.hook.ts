import { useContext } from 'react';
import { TimerContext } from './timer.context';

const useTimerStep = (id: string) => {
  const context = useContext(TimerContext);

  if (!context) {
    throw Error('useTimerStep: TimerContext is not defined');
  }

  const { state, dispatch } = context;

  const deleteStep = () => dispatch({ type: 'deleteStep', payload: { id } });
  const setTime = (d: number) => dispatch({ type: 'setStepTime', payload: { id, time: d } });
  const setTitle = (value: string) => dispatch({ type: 'setStepTitle', payload: { id, value } });
  const setDescription = (value: string) => dispatch({ type: 'setStepDescription', payload: { id, value } });

  return {
    amtOfSteps: state.steps.length,
    actions: { setTime, deleteStep, setTitle, setDescription },
  };
};

export { useTimerStep };
