import { StopwatchLap } from '@typings/stopwatch';
import { formatTime } from '@utils/formatTime.util';
import { useTranslation } from 'next-i18next';

interface Props {
  laps: StopwatchLap[];
}

const StopwatchLaps = ({ laps }: Props) => {
  const { t } = useTranslation('timer');
  if (laps.length === 0) return null;
  return (
    <section className="w-full grid gap-1 grid-rows-[auto,1fr] justify-center h-full overflow-hidden mt-6">
      <h2 className="text-start text-xl px-2">{t('laps')}</h2>
      <ol className="grid gap-4 w-80 h-[calc(100%-2rem)] overflow-scroll px-2 overflow-x-hidden content-start">
        {laps.map((lap, i) => (
          <li
            key={lap.id}
            className="grid grid-cols-[2rem,1fr] p-2 w-full border border-primary"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            <p className="row-span-2 font-medium text-xl mx-auto my-auto">{laps.length - i}</p>
            <p className="text-end text-lg">{formatTime(lap.createdAt)}</p>
            <p className="text-end text-secondary">{formatTime(lap.ranTime)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export { StopwatchLaps };
