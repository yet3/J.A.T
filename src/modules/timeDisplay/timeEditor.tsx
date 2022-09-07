import { timeToDuration } from '@utils/timeToDuration.util';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useState } from 'react';
import { flushSync } from 'react-dom';
import { prefixWith, prefixWithZeros } from '@utils/prefixWith.util';

interface Props {
  time: number;
  grayed?: boolean;

  setTime: (time: number) => void;
  stepId: string
}

const MAX_VALUES = [99, 59, 59];
const TIME_MULTIPLIERS = [60 * 60 * 1000, 60 * 1000, 1000];

const TimeEditor = ({ stepId, time, grayed, setTime }: Props) => {
  const { t } = useTranslation('common', { keyPrefix: 'time' });

  const [val, setVal] = useState(() => {
    const { hours, minutes, seconds } = timeToDuration(time);
    return [hours, minutes, seconds].map((v) => prefixWithZeros(v));
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    const el = e.target as HTMLInputElement;
    if (el.tagName !== 'INPUT') return;

    if (el.selectionStart === el.selectionEnd) {
      const sel = window.getSelection();
      if (!sel) return;

      if (e.key === 'ArrowLeft') {
        if (el.selectionStart === 0) {
          e.preventDefault();
          const prev = el.previousElementSibling as HTMLInputElement;
          if (prev && prev.tagName === 'INPUT') {
            prev.focus();
          }
        }
      } else if (e.key === 'ArrowRight') {
        if (el.selectionStart === el.value.length) {
          e.preventDefault();
          const next = el.nextElementSibling as HTMLInputElement;
          if (next && next.tagName === 'INPUT') {
            next.focus();
          }
        }
      }
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const index = e.target.dataset.index as unknown as number;
    if (index == null) return;

    const value = e.target.value.replace(/[^0-9]/gm, '');
    let parsed = parseInt(value, 10);

    if (isNaN(parsed) && value.length > 0) {
      e.preventDefault();
      return;
    }
    let mousePos = e.target.selectionStart || 0;

    let total = '';
    val.forEach((v, i) => {
      if (i != index) total += v;
      else total += prefixWith(value, '&');
    });

    const ar = total.substring(value.length - 2, total.length).match(/.{1,2}/g) as string[];
    if (ar.length < 3) {
      ar.splice(index, 0, '');
    }

    ar.forEach((a, i) => {
      ar[i] = a.replaceAll('&', '');
    });

    if (value.length > 2) {
      flushSync(() => {
        setVal(ar);
      });

      mousePos -= value.length - 2;
      e.target.setSelectionRange(mousePos, mousePos);
    } else setVal(ar);
  };

  const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault();
    let value = await navigator.clipboard.readText();
    value = value.replace(/[^0-9]/gm, '');
    const parsed = parseInt(value, 10);

    if (isNaN(parsed)) return;
    const index = (e.target as HTMLInputElement).dataset.index as unknown as number;
    if (index == null) return;

    const cloned = val.slice();
    if (parsed > MAX_VALUES[index]) {
      const dur = timeToDuration(parsed * 1000);
      cloned[0] = prefixWithZeros(dur.hours);
      cloned[1] = prefixWithZeros(dur.minutes);
      cloned[2] = prefixWithZeros(dur.seconds);
      setVal(cloned);
      return;
    }

    cloned[index] = prefixWithZeros(parsed);
    setVal(cloned);
  };

  const handleOnBlur = () => {
    const cloned = val.slice();
    let time = 0;
    cloned.forEach((v, i) => {
      const max = MAX_VALUES[i];
      let parsed = parseInt(v, 10);
      if (parsed > max) parsed = max;
      else if (parsed < 0) parsed = 0;

      time += TIME_MULTIPLIERS[i] * parsed;
      cloned[i] = prefixWithZeros(parsed);
    });
    setVal(cloned);

    setTime(time);
  };

  return (
    <div
      onPaste={handlePaste}
      onBlur={handleOnBlur}
      onKeyDown={handleKeyDown}
      className={clsx(
        'text-lg grid grid-cols-[3rem,3rem,3rem] gap-x-12 gap-y-1 place-items-center place-content-center',
        grayed ? 'text-secondary' : 'text-primary'
      )}
    >
      <EditorInput id={`step-${stepId}-hours-input`} index={0} value={val[0]} onChange={onInputChange} />
      <EditorInput id={`step-${stepId}-minutes-input`}index={1} value={val[1]} onChange={onInputChange} />
      <EditorInput id={`step-${stepId}-seconds-input`}index={2} value={val[2]} onChange={onInputChange} />
      <label htmlFor={`step-${stepId}-hours-input`} className="font-medium text-sm text-secondary">{t('hours')}</label>
      <label htmlFor={`step-${stepId}-minutes-input`} className="font-medium text-sm text-secondary">{t('minutes')}</label>
      <label htmlFor={`step-${stepId}-seconds-input`}className="font-medium text-sm text-secondary">{t('seconds')}</label>
    </div>
  );
};

export { TimeEditor };

interface InputProps {
  id: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string | null;
  index: number;
}

const EditorInput = ({id, value, onChange, index }: InputProps) => {
  return (
    <input
      id={id}
      data-index={index}
      onChange={onChange}
      inputMode='numeric'
      value={value || ''}
      className="w-full text-center bg-transparent text-primary outline-none text-3xl border-b border-primary"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    />
  );
};
