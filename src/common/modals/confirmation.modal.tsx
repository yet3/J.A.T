import { ModalBaseProps, ModalCloseFunc } from '@yet3/use-modal';
import { useTranslation } from 'next-i18next';
import { ReactNode } from 'react';

interface Props extends ModalBaseProps {
  content?: ReactNode;
  onConfirm: (closeModal: ModalCloseFunc) => void;
  onReject?: (closeModal: ModalCloseFunc) => void;
}

const ConfirmationModal = ({ closeModal, onConfirm, onReject, content }: Props) => {
  const { t } = useTranslation('common', { keyPrefix: 'confirmationModal' });

  const handleConfirm = () => {
    onConfirm(closeModal);
  };

  const handleReject = () => {
    if (onReject) onReject(closeModal);
    else closeModal();
  };

  return (
    <>
      <header className="text-center pb-3 text-lg">{content ?? t('defaultContent')}</header>
      <main className="grid grid-flow-col gap-4">
        <button onClick={handleReject} className="py-1">
          {t('rejectButton')}
        </button>
        <button onClick={handleConfirm} className="py-1">
          {t('confirmButton')}
        </button>
      </main>
    </>
  );
};

export { ConfirmationModal };
