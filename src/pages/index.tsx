import { MainLayout } from '@layouts/main.layout';
import { useTimer } from '@modules/timer/useTimer.hook';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const TimerRouterPage: NextPage = () => {
  const router = useRouter();
  const { mode } = useTimer();

  useEffect(() => {
    if (mode === 'timer') router.replace('/timer');
    else router.replace('/timer/editor');
  }, []);

  return <MainLayout />;
};

export default TimerRouterPage;

export async function getStaticProps(props: { locale: string }) {
  const { locale } = props;
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
