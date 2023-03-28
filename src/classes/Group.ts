import { grayscale } from '@/utils';
import type Idol from './Idol';

type EmptyGroup = {
  name: string;
  idols?: Idol[];
};

export type GroupObject = Required<EmptyGroup>;

export default class Group {
  static of(x: string | GroupObject): Group {
    return typeof x === 'string' ? new Group({ name: x }) : new Group(x);
  }

  name: string;
  idols: Idol[];

  constructor({ name, idols }: EmptyGroup) {
    this.name = name;
    this.idols = idols ?? [];
  }

  sort() {
    return {
      ...this,
      idols: this.idols.sort((a, b) =>
        this.name === 'Gray'
          ? grayscale(a.color) - grayscale(b.color)
          : a.color.hsl()[0] - b.color.hsl()[0],
      ),
    };
  }

  addIdol(idol: Idol) {
    return Group.of({ ...this, idols: [...this.idols, idol] });
  }
}
