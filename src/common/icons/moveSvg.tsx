import clsx from 'clsx';
import { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  grayed?: boolean;
}

const MoveSvg = ({ grayed, ...props }: Props) => {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M24.0001 14.6667H17.3334V8.00002H21.3334L16.0001 2.66669L10.6667 8.00002H14.6667V14.6667H8.00008V10.6667L2.66675 16L8.00008 21.3334V17.3334H14.6667V24H10.6667L16.0001 29.3334L21.3334 24H17.3334V17.3334H24.0001V21.3334L29.3334 16L24.0001 10.6667V14.6667Z"
        className={clsx('fill-current', grayed ? 'text-secondary' : 'text-primary')}
      />
    </svg>
  );
};

export { MoveSvg };
