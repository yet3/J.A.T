import '@styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { UseModal } from '@yet3/use-modal';
import { TimerProvider } from '@modules/timer/timer.context';
import { StopwatchProvider } from '@modules/stopwatch/stopwatch.context';

if (typeof document !== 'undefined') UseModal.setPortalElement(document.getElementById('modals')!);
UseModal.setOptions({
  modalWrapper: (
    <aside className="bg-primary border-primary border p-3 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] sm:w-auto sm:min-w-[15rem]" />
  ),
  backdropColor: 'rgba(0, 0, 0, 0.8)',
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TimerProvider>
      <StopwatchProvider>
        <Component {...pageProps} />
      </StopwatchProvider>
    </TimerProvider>
  );
}

export default appWithTranslation(MyApp);
