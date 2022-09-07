import { MoveSvg } from '@common/icons/moveSvg';
import { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import { TFunction } from 'next-i18next';
import { StepDeleteButton } from './deleteButton';

interface Props {
  stepIndex: number;
  amtOfSteps: number;
  isDragging?: boolean;

  deleteStep: () => void;

  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;

  t: TFunction;
}

const StepHeader = ({ stepIndex, amtOfSteps, isDragging, attributes, listeners, deleteStep, t }: Props) => {
  return (
    <header className="grid grid-cols-[1fr,1.25rem] items-center gap-2 w-full h-6 text-inherit mb-1">
      {amtOfSteps > 1 ? (
        <div {...attributes} {...listeners} className="flex cursor-grab text-inherit mr-auto">
          <button className="mr-2 cursor-grab" aria-label='Move step'>
            <MoveSvg width={24} height={24} grayed={isDragging} />
          </button>
          <p className="text-inherit">
            {stepIndex + 1}/{amtOfSteps}
          </p>
        </div>
      ) : (
        <div />
      )}

      <StepDeleteButton t={t} onDelete={deleteStep} disabled={isDragging} />
    </header>
  );
};

export { StepHeader };
