import { Seo } from '@common/seo';
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MainLayout } from '@layouts/main.layout';
import { StepDragOverlay } from '@modules/timer/step/stepDragOverlay';
import { StepsControls } from '@modules/timer/stepsControls';
import { Step } from '@modules/timer/step/step';
import { useTimer } from '@modules/timer/useTimer.hook';
import { TimerSavedStep, TimerStep } from '@typings/timer';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import { makeStepsSavable } from '@modules/timer/makeStepsSavable.util';
import { useRouter } from 'next/router';
import { autoId } from '@utils/autoId.util';

const TimerEditor: NextPage = () => {
  const {
    steps,
    totalTime,
    status,
    hasInitialized,
    actions: { addStep, moveStep, clear, start, setTimer, setMode },
  } = useTimer();
  const [selectedStep, setSelectedStep] = useState<TimerStep | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const router = useRouter();
  const { t } = useTranslation('timer');

  useEffect(() => {
    const query = router.query
    const urlSteps = query.steps;
    if (typeof urlSteps === 'string') {
      let savedSteps = JSON.parse(query.steps as string) as TimerSavedStep[]
      const steps: TimerStep[] = [];
      if (Array.isArray(savedSteps)) savedSteps.forEach(savedStep => {
        steps.push({
          id: autoId(),
          title: savedStep.title ?? '',
          description: savedStep.description ?? '',
          time: savedStep.time ?? 5000,
        })
      })

      setTimer({ steps })
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }, [router.query])

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    const timer = steps.find((t) => t.id === active.id);
    if (timer) setSelectedStep(timer);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (active && over) {
      moveStep(active.id as string, over.id as string);
    }

    setSelectedStep(null);
  };


  return (
    <MainLayout>
      <Seo titleKey="timerEditor" />
      {hasInitialized && (
        <>
          <StepsControls steps={steps} totalTime={totalTime} clear={clear} t={t} start={start} setMode={setMode} status={status} />

          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={steps.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <ol className="grid content-start items-start justify-items-center mt-4 w-full px-4">
                {steps.map((step, i) => (
                  <Step step={step} index={i} key={step.id} />
                ))}

                <li className="pb-12 flex justify-center pt-4">
                  <button className="flex p-4" onClick={addStep}>
                    <div className="translate-x-0 translate-y-0 w-6 h-6">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-text-primary w-full h-[2px]" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-text-primary w-[2px] h-full" />
                    </div>
                    <span className="ml-2">{t('actions.addStep')}</span>
                  </button>
                </li>
              </ol>
            </SortableContext>
            <StepDragOverlay step={selectedStep} />
          </DndContext>
        </>
      )}
    </MainLayout>
  );
};

export default TimerEditor;

export async function getStaticProps(props: { locale: string }) {
  const { locale } = props;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'timer'])),
    },
  };
}
