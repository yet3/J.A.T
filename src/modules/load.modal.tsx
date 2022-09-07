import { ControlBtn } from '@common/controlBtn';
import { SavedTimer } from '@typings/timer';
import { autoId } from '@utils/autoId.util';
import { ModalBaseProps } from '@yet3/use-modal';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { SavedTimersList } from './savedTimersList';
import { useTimer } from './timer/useTimer.hook';

interface Props extends ModalBaseProps {}

const LoadModal = ({ closeModal }: Props) => {
  const {
    actions: { setTimer },
  } = useTimer();
  const { t } = useTranslation('timer', { keyPrefix: 'loadModal' });
  const [selectedSaveId, setSelectedSaveId] = useState<null | string>(null);
  const [timers, setTimers] = useState<SavedTimer[]>([]);

  useEffect(() => {
    const savesJSON = window.localStorage.getItem('timerSaves');
    if (savesJSON) {
      const parsed = JSON.parse(savesJSON) as SavedTimer[];
      setTimers(parsed);
    }
  }, []);

  const handleLoad = (timer: SavedTimer) => {
    setTimer({
      startedAt: 0,
      pausedAt: 0,
      saveId: timer.id,
      steps: timer.steps.map((s) => ({
        id: autoId(),
        time: s.time,
        title: s.title,
        description: s.description,
      })),
    });

    closeModal();
  };

  const handleTimerSelect = (timer: SavedTimer) => {
    if (selectedSaveId !== timer.id) {
      setSelectedSaveId(timer.id);
    } else {
      setSelectedSaveId(null);
    }
  };

  return (
    <div className="w-80 grid gap-3">
      <header className="text-center text-lg">{t('header')}</header>
      <main className="grid gap-4">
        {timers.length > 0 && (
          <SavedTimersList
            timers={timers}
            onTimerClick={handleTimerSelect}
            onTimerDoubleClick={handleLoad}
            selectedTimerId={selectedSaveId}
          />
        )}
      </main>
      <footer className="grid grid-flow-col gap-4">
        <ControlBtn text={t('cancel')} onClick={closeModal} />
        <ControlBtn
          text={t('load')}
          onClick={() => {
            const timer = timers.find((t) => t.id === selectedSaveId);
            if (timer) handleLoad(timer);
          }}
          disabled={!selectedSaveId}
        />
      </footer>
    </div>
  );
};

export { LoadModal };
