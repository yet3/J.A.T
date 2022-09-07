import { prefixWithZeros } from './prefixWith.util';
import { timeToDuration } from './timeToDuration.util';

export const formatTime = (time: number, skipMills = false) => {
  const dur = timeToDuration(time);
  return `${prefixWithZeros(dur.hours)}:${prefixWithZeros(dur.minutes)}:${prefixWithZeros(dur.seconds)}${
    skipMills ? '' : `:${prefixWithZeros(dur.milliseconds, 3)}`
  }`;
};
