export const prefixWith = (
  c: string | number,
  prefix: string,
  opts = { length: 2 }
): string => {
  let valueString = c.toString();
  return (
    prefix.repeat(opts.length).substring(0, opts.length - valueString.length) +
    valueString
  );
};

export const prefixWithZeros = (c: string | number, length = 2) =>
  prefixWith(c, "0", { length });
