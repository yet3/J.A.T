import { ControlBtn } from '@common/controlBtn';
import { Seo } from '@common/seo';
import { useAutoRerender } from '@common/useAutoRerender.hook';
import { MainLayout } from '@layouts/main.layout';
import { TimeDisplay } from '@modules/timeDisplay/timeDisplay';
import { useTimer } from '@modules/timer/useTimer.hook';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const TimerPage: NextPage = () => {
  const { t } = useTranslation('timer');
  const router = useRouter();
  const {
    status,
    time,
    currentStep,
    currentStepIndex,
    amtOfSteps,
    hasInitialized,
    actions: { start, pause, reset, setMode, nextStep, previousStep },
  } = useTimer();
  useAutoRerender({ every: 20, isRunning: status === 'running' });

  const handleEditSteps = () => {
    pause();
    setMode('editor');
    router.push('/timer/editor');
  };

  return (
    <MainLayout>
      <Seo titleKey="timer" />
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
            <ControlBtn text={t('navigation.editSteps')} onClick={handleEditSteps} />
          </section>
          <TimeDisplay time={time} size="lg" />
          <section className="mt-8 grid grid-cols-[9rem,auto,9rem] items-center gap-4">
            <ControlBtn
              text={t('actions.previousStep')}
              disabled={status !== 'running' || currentStepIndex <= 0}
              onClick={previousStep}
              size="sm"
            />
            <span className="font-medium text-xl text-primary">
              {currentStepIndex + 1}/{amtOfSteps}
            </span>
            <ControlBtn
              text={t('actions.nextStep')}
              disabled={status !== 'running' || currentStepIndex >= amtOfSteps - 1}
              onClick={nextStep}
              size="sm"
            />
          </section>
          {currentStep && (
            <section className="max-w-[360px] mt-4 text-center">
              <h2 className="font-medium text-xl mb-2">{currentStep.title}</h2>
              <p>
                <pre>{currentStep.description}</pre>
              </p>
            </section>
          )}
        </>
      )}
    </MainLayout>
  );
};

export default TimerPage;

export async function getStaticProps(props: { locale: string }) {
  const { locale } = props;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'timer'])),
    },
  };
}
