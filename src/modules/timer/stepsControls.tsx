import { ControlBtn } from '@common/controlBtn';
import { ConfirmationModal } from '@common/modals/confirmation.modal';
import { LoadModal } from '@modules/load.modal';
import { SaveModal } from '@modules/save.modal';
import { TimeDisplay } from '@modules/timeDisplay/timeDisplay';
import { TimerMode, TimerStatus, TimerStep } from '@typings/timer';
import { useModal } from '@yet3/use-modal';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { TimerShareBtn } from './shareBtn';

interface Props {
  status: TimerStatus;
  totalTime: number;
  setMode: (mode: TimerMode) => void;
  clear: () => void;
  start: (forced?: boolean) => void;
  t: TFunction;
  steps: TimerStep[]
}

const StepsControls = ({ steps, status, totalTime, setMode, clear, t, start }: Props) => {
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
    <div className="grid grid-cols-[repeat(3,minmax(6rem,1fr))] gap-2 max-w-sm">
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
      <ControlBtn text={t('actions.save')} onClick={() => saveModal.open()} />
      <ControlBtn text={t('actions.load')} onClick={() => loadModal.open()} />
      <TimerShareBtn steps={steps} t={t} />

      {clearModal.component}
      {saveModal.component}
      {loadModal.component}
    </div>
  );
};

export { StepsControls };
