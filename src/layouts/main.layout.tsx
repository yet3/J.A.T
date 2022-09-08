import { Header } from '@modules/header/header';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  childrenClassName?: string;
}

const MainLayout = ({ children, childrenClassName }: Props) => {
  return (
    <div className="h-screen w-full grid gap-4 grid-rows-[auto,1fr]">
      <Header />

      <main className={clsx('main-layout-main', childrenClassName)}>{children}</main>
    </div>
  );
};

export { MainLayout };
