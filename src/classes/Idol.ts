import * as chroma from 'chroma.ts';

import { IIdol, IColorType } from './types';

export default class Idol {
  constructor(idol: IIdol) {
    this.ja = idol.ja;
    this.en = idol.en;
    this.hex = idol.hex;
    this.color = chroma.color(idol.hex);
    this.isOffical = idol.isOffical;
  }

  ja: string;

  en?: string;

  private hex: `#${string}`;

  color: chroma.Color;

  isOffical?: boolean;

  get(type: IColorType) {
    return type === 'hex' ? this.hex : this.color.css(type);
  }

  static colorEqual(a: Idol, b: Idol) {
    return a.get('hex') === b.get('hex');
  }

  static merge(a: Idol, b: Idol) {
    if (!this.colorEqual(a, b)) return a;

    return new Idol({
      ...a,
      ja: `${a.ja} & ${b.ja}`,
      en: `${a.en} & ${b.en}`,
      hex: a.hex,
    });
  }
}
