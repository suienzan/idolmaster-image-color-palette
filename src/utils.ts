// eslint-disable-next-line import/prefer-default-export
export const removePrefix = (str: string) => {
  if (str.startsWith('#')) {
    return str.slice(1);
  }
  if (str.startsWith('hsl(') || str.startsWith('rgb(')) {
    return str.slice(4, -1);
  }
  return str;
};
