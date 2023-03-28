export type ColorType = 'rgb' | 'hsl' | 'hex';

export type IdolObject = {
  ja: string;
  en?: string;
  hex: `#${string}`;
  isOffical?: boolean;
};

export type Production = {
  name: string;
  idols: IdolObject[];
};
