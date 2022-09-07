import { timeToDuration } from '@utils/timeToDuration.util';
import { prefixWithZeros } from '@utils/prefixWith.util';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';

type Size = 'sm' | 'base' | 'lg';
interface Props {
  time: number;

  grayed?: boolean;
  size?: Size;

  withMills?: boolean;
}

interface TextProps {
  size: Size;
  value: string;
}

const Time = ({ value, size }: TextProps) => (
  <p
    className={clsx('text-primary', {
      'text-xl': size === 'sm',
      'text-2xl sm:text-3xl': size === 'base',
      'text-3xl sm:text-4xl': size === 'lg',
    })}
  >
    {value}
  </p>
);

const TimeUnit = ({ value, size }: TextProps) => (
  <p
    className={clsx('tracking-wide text-secondary', {
      'text-xs': size === 'sm',
      'text-xs font-medium ': size === 'base',
      'text-sm font-medium ': size === 'lg',
    })}
  >
    {value}
  </p>
);

const TimeDisplay = ({ time, grayed, size = 'base', withMills }: Props) => {
  const { t } = useTranslation('common', { keyPrefix: 'time' });

  const { hours, minutes, seconds, milliseconds } = timeToDuration(time);
  return (
    <div
      className={clsx(
        'text-lg grid grid-flow-col justify-center',
        size === 'lg' ? 'gap-4 sm:gap-10' : 'gap-4 sm:gap-8',
        grayed ? 'text-secondary' : 'text-primary'
      )}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      <div className="text-center">
        <Time size={size} value={prefixWithZeros(hours)} />
        <TimeUnit size={size} value={t('hours')} />
      </div>
      <div className="text-center">
        <Time size={size} value={prefixWithZeros(minutes)} />
        <TimeUnit size={size} value={t('minutes')} />
      </div>
      <div className="text-center">
        <Time size={size} value={prefixWithZeros(seconds)} />
        <TimeUnit size={size} value={t('seconds')} />
      </div>
      {withMills && (
        <div className="text-center">
          <Time size={size} value={prefixWithZeros(milliseconds, 3)} />
          <TimeUnit size={size} value={t('milliseconds')} />
        </div>
      )}
    </div>
  );
};

export { TimeDisplay };
