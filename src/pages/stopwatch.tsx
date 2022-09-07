import { ControlBtn } from '@common/controlBtn';
import { Seo } from '@common/seo';
import { useAutoRerender } from '@common/useAutoRerender.hook';
import { MainLayout } from '@layouts/main.layout';
import { StopwatchLaps } from '@modules/stopwatch/laps/laps';
import { useStopwatch } from '@modules/stopwatch/useStopwatch.hook';
import { TimeDisplay } from '@modules/timeDisplay/timeDisplay';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const StopwatchPage: NextPage = () => {
  const {
    actions: { start, pause, reset, lap },
    status,
    time,
    hasInitialized,
    laps,
  } = useStopwatch();
  useAutoRerender({ every: 10, isRunning: status === 'running' });
  const { t } = useTranslation('stopwatch');

  return (
    <MainLayout childrenClassName="overflow-hidden">
      <Seo titleKey="stopwatch" />
      {hasInitialized && (
        <>
          <section className="grid grid-flow-col gap-4 mb-8">
            <ControlBtn
              stage={status === 'running' ? 'pause' : 'start'}
              stages={{
                start: { text: t('actions.start'), onClick: () => start() },
                pause: { text: t('actions.pause'), onClick: () => pause() },
              }}
            />
            <ControlBtn text={t('actions.reset')} onClick={() => reset()} />
            <ControlBtn text={t('actions.lap')} onClick={() => lap()} />
          </section>
          <TimeDisplay time={time} withMills size="lg" />
          <StopwatchLaps laps={laps} />
        </>
      )}
    </MainLayout>
  );
};

export default StopwatchPage;

export async function getStaticProps(props: { locale: string }) {
  const { locale } = props;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'stopwatch'])),
    },
  };
}
