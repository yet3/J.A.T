const timeToDuration = (mills: number) => {
  mills = Math.max(0, mills);

  const totalSeconds = Math.floor(mills / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  return {
    totalHours: totalHours,
    hours: Math.min(99, totalHours),
    minutes: totalMinutes - totalHours * 60,
    seconds: totalSeconds - totalMinutes * 60,
    milliseconds: mills - totalSeconds * 1000,
  };
};

export { timeToDuration };
