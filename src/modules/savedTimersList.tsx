import { SavedTimer } from '@typings/timer';
import { formatTime } from '@utils/formatTime.util';
import clsx from 'clsx';

interface Props {
  timers: SavedTimer[];
  selectedTimerId?: string | null;
  onTimerClick?: (save: SavedTimer) => void;
  onTimerDoubleClick?: (save: SavedTimer) => void;
}

const sortTimers = (a: SavedTimer, b: SavedTimer) => {
  return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
};

const SavedTimersList = ({ timers, selectedTimerId, onTimerClick, onTimerDoubleClick }: Props) => {
  return (
    <ul className="border border-primaryp p-2 grid gap-2 content-start overflow-y-auto max-h-48">
      {timers.sort(sortTimers).map((timer) => {
        const totalTime = timer.steps.reduce((total, step) => total + step.time, 0);
        return (
          <li
            key={timer.id}
            role="button"
            className={clsx('flex', timer.id === selectedTimerId ? 'text-primary' : 'text-secondary')}
            onDoubleClick={() => {
              if (onTimerDoubleClick) onTimerDoubleClick(timer);
            }}
            onClick={() => {
              if (onTimerClick) onTimerClick(timer);
            }}
          >
            <p className="text-inherit">{timer.title}</p>
            <p className="text-inherit ml-auto">{formatTime(totalTime, true)}</p>
          </li>
        );
      })}
    </ul>
  );
};

export { SavedTimersList };
