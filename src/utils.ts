import * as chroma from 'chroma.ts';

export const removePrefix = (color: string) => {
  if (color.startsWith('#')) {
    return color.slice(1);
  }
  if (color.startsWith('hsl(') || color.startsWith('rgb(')) {
    return color.slice(4, -1);
  }
  return color;
};

export const grayscale = (color: chroma.Color) => {
  const [r, g, b] = color.rgb();
  return (Math.max(r, g, b) - Math.min(r, g, b)) / (100 + (r + g + b) / 3 / 2.55);
};
