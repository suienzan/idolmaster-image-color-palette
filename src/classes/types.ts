export type IColorType = 'rgb' | 'hsl' | 'hex';

export interface IIdol {
  ja: string;
  en?: string;
  hex: `#${string}`;
  isOffical?: boolean;
}

export interface IProduction {
  name: string;
  idols: IIdol[];
}
