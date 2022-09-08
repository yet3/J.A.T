import { ControlBtn } from '@common/controlBtn';
import { ConfirmationModal } from '@common/modals/confirmation.modal';
import { LoadModal } from '@modules/load.modal';
import { SaveModal } from '@modules/save.modal';
import { TimeDisplay } from '@modules/timeDisplay/timeDisplay';
import { TimerMode, TimerStatus } from '@typings/timer';
import { useModal } from '@yet3/use-modal';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';

interface Props {
  status: TimerStatus;
  totalTime: number;
  setMode: (mode: TimerMode) => void;
  clear: () => void;
  start: (forced?: boolean) => void;
  t: TFunction;
}

const StepsControls = ({ status, totalTime, setMode, clear, t, start }: Props) => {
  const router = useRouter();
  const saveModal = useModal(SaveModal, { closeOnBackdropClick: false });
  const loadModal = useModal(LoadModal, { closeOnBackdropClick: false });
  const clearModal = useModal(ConfirmationModal, {
    props: {
      content: t('actions.clearConfirmation') as string,
      onConfirm: (closeModal) => {
        clear();
        closeModal();
      },
    },
  });

  return (
    <div className="grid grid-cols-3 gap-2 max-w-sm">
      <ControlBtn
        text={t('navigation.set')}
        onClick={() => {
          setMode('timer');
          router.push('/timer');
        }}
      />
      <ControlBtn
        text={status === 'paused' ? t('navigation.continue') : t('navigation.start')}
        onClick={() => {
          setMode('timer');
          start();
          router.push('/timer');
        }}
      />
      <ControlBtn text={t('actions.clear')} onClick={() => clearModal.open()} />
      <div className={'grid gap-1 border border-primary p-1 col-span-full'}>
        <TimeDisplay time={totalTime} size="sm" />
      </div>
      <div className="col-span-full grid grid-cols-2 gap-2">
        <ControlBtn text={t('actions.save')} onClick={() => saveModal.open()} />
        <ControlBtn text={t('actions.load')} onClick={() => loadModal.open()} />
      </div>

      {clearModal.component}
      {saveModal.component}
      {loadModal.component}
    </div>
  );
};

export { StepsControls };
