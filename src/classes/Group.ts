import { grayscale } from '@/utils';
import Idol from './Idol';

interface IEmptyGroup {
  name: string;
  idols?: Idol[];
}

export type IGroup = Required<IEmptyGroup>;

export default class Group {
  constructor({ name, idols }: IEmptyGroup) {
    this.name = name;
    this.idols = idols || [];
  }

  name: string;

  idols: Idol[];

  static of(g: string | IGroup): Group {
    return typeof g === 'string' ? new Group({ name: g }) : new Group(g);
  }

  sort() {
    return {
      ...this,
      idols: this.idols.sort((a, b) => (this.name === 'Gray'
        ? grayscale(a.color) - grayscale(b.color)
        : a.color.hsl()[0] - b.color.hsl()[0])),
    };
  }

  addIdol(idol: Idol) {
    return Group.of({ ...this, idols: [...this.idols, idol] });
  }
}
