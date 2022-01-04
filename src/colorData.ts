import * as chroma from 'chroma.ts';
import untypedColorData from '../colorData.json';

export type IColorType = 'rgb' | 'hsl' | 'hex';

export interface IIdol {
  ja: string;
  en?: string;
  hex: string;
}

export class Idol {
  constructor(idol: IIdol) {
    this.ja = idol.ja;
    this.en = idol.en;
    this.hex = idol.hex;
    this.color = chroma.color(idol.hex);
  }

  ja: string;

  en?: string;

  private hex: string;

  color: chroma.Color;

  get(type: IColorType) {
    return type === 'hex' ? this.hex : this.color.css(type);
  }

  static colorEqual(a: Idol, b: Idol) {
    return a.get('hex') === b.get('hex');
  }

  static merge(a: Idol, b: Idol) {
    if (!this.colorEqual(a, b)) return a;

    return new Idol({
      ja: `${a.ja} & ${b.ja}`,
      en: `${a.en} & ${b.en}`,
      hex: a.hex,
    });
  }
}

export interface IProduction {
  name: string;
  idols: Idol[];
}

export const colorData = untypedColorData.map((production) => ({
  name: production.name,
  idols: production.idols
    .map((idol) => new Idol(idol))
    // Merge idols with same color. (Saying Ami Futami and Mami Futami)
    .reduce((aac: Idol[], idol, index) => {
      const sameColorIndex = aac.findIndex((x) => Idol.colorEqual(x, idol));
      if (sameColorIndex === -1 && sameColorIndex < index) return aac.concat([idol]);
      return Object.assign([], aac, { [sameColorIndex]: Idol.merge(aac[sameColorIndex], idol) });
    }, []),
}));
