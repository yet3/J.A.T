import { ConfirmationModal } from '@common/modals/confirmation.modal';
import { useModal } from '@yet3/use-modal';
import clsx from 'clsx';
import { TFunction } from 'next-i18next';

interface Props {
  onDelete: () => void;
  disabled?: boolean;
  t: TFunction;
}

const StepDeleteButton = ({ onDelete, disabled, t }: Props) => {
  const deleteModal = useModal(ConfirmationModal, {
    props: {
      content: t('deleteConfirmation') as string,
      onConfirm: () => {
        onDelete();
      },
    },
  });

  return (
    <>
      <button className="translate-x-0 translate-y-0 bg-primary w-5 h-5 ml-auto" onClick={() => deleteModal.open()} aria-label='Delete step'>
        <div
          className={clsx('absolute w-full h-[2px] rotate-45', disabled ? 'bg-text-secondary' : 'bg-text-primary')}
        />
        <div
          className={clsx('absolute w-full h-[2px] -rotate-45', disabled ? 'bg-text-secondary' : 'bg-text-primary')}
        />
      </button>
      {deleteModal.component}
    </>
  );
};

export { StepDeleteButton };
