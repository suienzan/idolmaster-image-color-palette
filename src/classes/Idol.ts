import * as chroma from 'chroma.ts';

import { prop } from 'ramda';
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

  static merge(idols: Idol[]) {
    return new Idol({
      ...idols[0],
      ja: idols.map(prop('ja')).join(' & '),
      en: idols.map(prop('en')).join(' & '),
      hex: idols[0].hex,
    });
  }
}
