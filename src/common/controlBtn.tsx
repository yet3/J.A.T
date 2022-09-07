import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type TTT = Record<
  string,
  {
    text?: string;
    icon?: string;
    onClick?: () => void;
  }
>;

interface Props<S extends TTT> extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text?: string;
  icon?: string;

  stages?: S;
  stage?: keyof S;
  size?: 'sm' | 'base';
}

const ControlBtn = <S extends TTT>({
  text: defText,
  size = 'base',
  stage,
  stages,
  icon,
  className,
  ...props
}: Props<S>) => {
  let text = defText;
  let onClick = props.onClick;
  if (stages && stage) {
    const s = stages[stage];
    if (s) {
      text = s.text;
      onClick = s.onClick;
    }
  }

  return (
    <button {...props} onClick={onClick} className={clsx('button', size === 'base' ? 'button-size-base' : 'button-size-sm', className)}>
      {text}
    </button>
  );
};

export { ControlBtn };
