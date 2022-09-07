const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
const autoId = (length = 8) => {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return str;
};

export { autoId };
