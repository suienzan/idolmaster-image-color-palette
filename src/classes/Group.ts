import Idol from './Idol';

interface IGroup {
  name: string;
  idols?: Idol[];
}
export default class Group {
  constructor({ name, idols }: IGroup) {
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
      idols: this.idols.sort((a, b) => b.color.hsl()[2] - a.color.hsl()[2]),
    };
  }

  addIdol(idol: Idol) {
    return Group.of({ ...this, idols: [...this.idols, idol] });
  }
}
