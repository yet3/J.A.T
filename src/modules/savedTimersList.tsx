import { ConfirmationModal } from '@common/modals/confirmation.modal';
import { SavedTimer } from '@typings/timer';
import { formatTime } from '@utils/formatTime.util';
import { useModal } from '@yet3/use-modal';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';

interface Props {
  timers: SavedTimer[];
  selectedTimerId?: string | null;
  onTimerClick?: (save: SavedTimer) => void;
  onTimerDoubleClick?: (save: SavedTimer) => void;

  onDelete?: (saveId: string) => void;
}

const sortTimers = (a: SavedTimer, b: SavedTimer) => {
  return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
};

const SavedTimersList = ({ onDelete, timers, selectedTimerId, onTimerClick, onTimerDoubleClick }: Props) => {
  const { t } = useTranslation('timer', { keyPrefix: 'saveModal' });
  const confirmDeleteModal = useModal(ConfirmationModal);

  return (
    <ul
      className={clsx(
        'border border-primary p-2 grid gap-2 content-start overflow-y-auto h-48',
        timers.length === 0 && 'place-items-center'
      )}
    >
      {timers.length === 0 && <span className="text-secondary">{t('noSaves')}</span>}

      {timers.sort(sortTimers).map((timer) => {
        const totalTime = timer.steps.reduce((total, step) => total + step.time, 0);
        return (
          <li
            key={timer.id}
            role="button"
            className={clsx('flex items-center', timer.id === selectedTimerId ? 'text-primary' : 'text-secondary')}
            onDoubleClick={() => {
              if (onTimerDoubleClick) onTimerDoubleClick(timer);
            }}
            onClick={() => {
              if (onTimerClick) onTimerClick(timer);
            }}
          >
            <p className="text-inherit">{timer.title}</p>
            <p className="text-inherit ml-auto">{formatTime(totalTime, true)}</p>
            {onDelete && (
              <button
                className="translate-x-0 translate-y-0 w-4 h-4 ml-1 group"
                onClick={() =>
                  confirmDeleteModal.open({
                    props: {
                      onConfirm: (closeModal) => {
                        if (onDelete) onDelete(timer.id);
                        closeModal();
                      },
                    },
                  })
                }
                aria-label="Delete save"
              >
                <div className={clsx('absolute w-full h-[2px] rotate-45 bg-secondary group-hover:bg-white')} />
                <div className={clsx('absolute w-full h-[2px] -rotate-45 bg-secondary group-hover:bg-white')} />
              </button>
            )}
          </li>
        );
      })}
      {confirmDeleteModal.component}
    </ul>
  );
};

export { SavedTimersList };
