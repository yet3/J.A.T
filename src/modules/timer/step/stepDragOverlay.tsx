import { DragOverlay } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { TimeDisplay } from '@modules/timeDisplay/timeDisplay';
import { TimerStep } from '@typings/timer';

interface Props {
  step: TimerStep | null;
}

const StepDragOverlay = ({ step }: Props) => {
  return (
    <DragOverlay modifiers={[snapCenterToCursor]} dropAnimation={null}>
      {step ? (
        <div className="p-4 border border-primary bg-primary opacity-75 cursor-move w-fit">
          <TimeDisplay time={step.time} />
        </div>
      ) : null}
    </DragOverlay>
  );
};

export { StepDragOverlay };
