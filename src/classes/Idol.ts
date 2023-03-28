import * as chroma from 'chroma.ts';

import { prop } from 'ramda';
import { type IdolObject, type ColorType } from './types';

export default class Idol {
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

  ja: string;
  en?: string;
  color: chroma.Color;
  isOffical?: boolean;
  private readonly hex: `#${string}`;

  constructor(idol: IdolObject) {
    this.ja = idol.ja;
    this.en = idol.en;
    this.hex = idol.hex;
    this.color = chroma.color(idol.hex);
    this.isOffical = idol.isOffical;
  }

  get(type: ColorType) {
    return type === 'hex' ? this.hex : this.color.css(type);
  }
}
