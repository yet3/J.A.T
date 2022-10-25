import { ControlBtn } from '@common/controlBtn';
import { ConfirmationModal } from '@common/modals/confirmation.modal';
import { SavedTimer } from '@typings/timer';
import { autoId } from '@utils/autoId.util';
import { ModalBaseProps, useModal } from '@yet3/use-modal';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { SavedTimersList } from './savedTimersList';
import { useTimer } from './timer/useTimer.hook';

interface Props extends ModalBaseProps {}

const SaveModal = ({ closeModal }: Props) => {
  const {
    steps,
    saveId,
    actions: { setTimer },
  } = useTimer();

  const { t } = useTranslation('timer', { keyPrefix: 'saveModal' });
  const saveConfirmation = useModal(ConfirmationModal);
  const [title, setTitle] = useState('');
  const [selectedSaveId, setSelectedSaveId] = useState<null | string>(saveId);
  const [saves, setSaves] = useState<SavedTimer[]>([]);
  const [shoulUnselect, setShouldUnselect] = useState(saveId == null);

  useEffect(() => {
    const savesJSON = window.localStorage.getItem('timerSaves');
    if (savesJSON) {
      const parsed = JSON.parse(savesJSON) as SavedTimer[];

      if (saveId) {
        const timer = parsed.find((t) => t.id === saveId);
        if (timer) setTitle(timer.title);
      }

      setSaves(parsed);
    }
  }, [saveId]);

  const handleSave = (save?: SavedTimer) => {
    const id = save ? save.id : selectedSaveId;
    const index = saves.findIndex((s) => (id ? s.id === id : s.title === title.trim()));
    if (index >= 0) {
      if (id === saveId) {
        if (save) addSave(save.title, index);
        else addSave(title, index);
        return;
      }

      saveConfirmation.open({
        props: {
          content: t('overwriteConfirmation') + saves[index].title,
          onConfirm: () => {
            if (save) addSave(save.title, index);
            else addSave(title, index);
          },
        },
      });
    } else addSave();
  };

  const addSave = (timerTitle = title, indexToRemove: number = -1) => {
    if (typeof window === 'undefined') return;

    const tmp = saves.slice();
    if (indexToRemove >= 0) tmp.splice(indexToRemove, 1);
    const id = autoId();
    tmp.push({
      id,
      title: timerTitle.trim(),
      steps: steps.map((s) => ({ time: s.time, title: s.title, description: s.description })),
      savedAt: new Date(),
    });

    window.localStorage.setItem('timerSaves', JSON.stringify(tmp));
    setSaves(tmp);
    setTimer({ saveId: id });
    closeModal();
  };

  const handleDeleteSave = (saveId: string) => {
    if (typeof window === 'undefined') return;

    const tmp = saves.slice();
    const index = tmp.findIndex((s) => s.id === saveId);
    if (index < 0) return;
    tmp.splice(index, 1);

    window.localStorage.setItem('timerSaves', JSON.stringify(tmp));
    setSaves(tmp);
  };

  const handleTimerSelect = (timer: SavedTimer) => {
    if (!shoulUnselect) setShouldUnselect(true);

    if (selectedSaveId !== timer.id) {
      setTitle(timer.title);
      setSelectedSaveId(timer.id);
    } else {
      if (timer.title === title) setTitle('');
      setSelectedSaveId(null);
    }
  };

  return (
    <div className="w-80 grid gap-3">
      <header className="text-center text-lg">{t('header')}</header>
      <main className="grid gap-4">
        <input
          placeholder={t('titlePlaceholder')}
          className="bg-transparent border-b border-primary py-1 outline-none"
          value={title}
          onChange={(e) => {
            if (!shoulUnselect) {
              setSelectedSaveId(null);
              setShouldUnselect(true);
            }
            setTitle(e.target.value);
          }}
        />
        <SavedTimersList
          timers={saves}
          onDelete={handleDeleteSave}
          onTimerClick={handleTimerSelect}
          onTimerDoubleClick={handleSave}
          selectedTimerId={selectedSaveId}
        />
      </main>
      <footer className="grid grid-flow-col gap-4">
        <ControlBtn text={t('cancel')} onClick={closeModal} />
        <ControlBtn text={t('save')} onClick={() => handleSave()} disabled={title.trim().length === 0} />
      </footer>
      {saveConfirmation.component}
    </div>
  );
};

export { SaveModal };
