// eslint-disable-next-line import/prefer-default-export
export const removePrefix = (color: string) => {
  if (color.startsWith('#')) {
    return color.slice(1);
  }
  if (color.startsWith('hsl(') || color.startsWith('rgb(')) {
    return color.slice(4, -1);
  }
  return color;
};
