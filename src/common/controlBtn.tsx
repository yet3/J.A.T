import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type TTT = Record<
  string,
  {
    text?: string;
    onClick?: () => void;
  }
>;

interface Props<S extends TTT> extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text?: string;

  stages?: S;
  stage?: keyof S;
  size?: 'sm' | 'base';
}

const ControlBtn = <S extends TTT>({
  text: defText,
  size = 'base',
  stage,
  stages,
  className,
  ...props
}: Props<S>) => {
  let text = defText;
  let onClick = props.onClick;
  if (stages && stage) {
    const s = stages[stage];
    if (s) {
      if (s.text) text = s.text;
      if (s.onClick) onClick = s.onClick;
    }
  }

  return (
    <button {...props} onClick={onClick} className={clsx('button', size === 'base' ? 'button-size-base' : 'button-size-sm', className)}>
      {text}
    </button>
  );
};

export { ControlBtn };
