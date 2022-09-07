import Link from 'next/link';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useTimer } from '@modules/timer/useTimer.hook';
import { TFunction, useTranslation } from 'next-i18next';

const Nav = () => {
  const { t } = useTranslation('common', { keyPrefix: 'pages' });

  return (
    <nav className="grid grid-flow-col place-content-center place-items-center gap-4 h-full">
      <Btn type="timers" t={t} />
      <Btn type="stopwatch" t={t} />
    </nav>
  );
};

interface BtnProps {
  type: 'timers' | 'stopwatch';
  t: TFunction;
}

const Btn = ({ type, t }: BtnProps) => {
  const { pathname } = useRouter();
  const timer = useTimer();

  let href = '/';
  let content = '';
  if (type === 'timers') {
    if (timer.mode === 'timer') href = '/timer';
    else href = '/timer/editor';
    content = t('timer');
  } else if (type === 'stopwatch') {
    href = '/stopwatch';
    content = t('stopwatch');
  }

  const isSelected = pathname === href;
  return (
    <Link href={href}>
      <span className={clsx('cursor-pointer', isSelected ? 'text-primary' : 'text-secondary')}>{content}</span>
    </Link>
  );
};

export { Nav };
