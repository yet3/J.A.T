import { useSortable } from '@dnd-kit/sortable';
import { useTimerStep } from '../useTimerStep.hook';
import { TimerStep } from '@typings/timer';
import { CSS } from '@dnd-kit/utilities';
import { TFunction, useTranslation } from 'next-i18next';
import clsx from 'clsx';
import { TimeEditor } from '@modules/timeDisplay/timeEditor';
import { StepHeader } from './stepHeader';
import { useEffect, useRef } from 'react';

interface Props {
  step: TimerStep;
  index: number;
}

const Step = ({ index, step }: Props) => {
  const { t } = useTranslation('timer', { keyPrefix: 'step' });
  const {
    amtOfSteps,
    actions: { deleteStep, setTitle, setDescription, setTime },
  } = useTimerStep(step.id);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={clsx(
        'touch-none',
        'grid gap-1 w-full max-w-sm sm:w-96 min-h-32 border my-2 content-start items-start grid-rows-[auto,auto,1fr] p-1'
      )}
    >
      <StepHeader
        t={t}
        deleteStep={deleteStep}
        stepIndex={index}
        amtOfSteps={amtOfSteps}
        attributes={attributes}
        listeners={listeners}
        isDragging={isDragging}
      />

      <TimeEditor stepId={step.id} setTime={setTime} time={step.time} grayed={isDragging} />
      <input
        value={step.title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-transparent outline-none border-none resize-none text-lg font-medium px-1"
        placeholder={t('title_placeholder')}
      />
      <AutoTextArea t={t} step={step} setDescription={setDescription} />
    </li>
  );
};

export { Step };

interface TaProps {
  t: TFunction;
  step: TimerStep;
  setDescription: (v: string) => void;
}

const AutoTextArea = ({ t, step, setDescription }: TaProps) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    if (el.scrollHeight < 100) {
      el.style.height = el.scrollHeight + 'px';
    } else el.style.height = '100px';
  }, []);

  return (
    <textarea
      value={step.description}
      ref={ref}
      onChange={(e) => {
        const el = e.target;
        el.style.height = '48px';
        if (el.scrollHeight < 100) {
          el.style.height = el.scrollHeight + 'px';
        } else el.style.height = '100px';
        setDescription(e.target.value);
      }}
      className="bg-transparent outline-none border-none resize-none px-1"
      placeholder={t('description_placeholder')}
    />
  );
};
