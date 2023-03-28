import untypedColorData from '@/colorData.json';
import { type Production } from './classes/types';
import { type GroupObject } from './classes/Group';
import Idol from './classes/Idol';

const colorData = untypedColorData as Production[];

const group: GroupObject[] = colorData.map((production) => ({
  name: production.name,
  idols: production.idols
    .map((idol) => new Idol(idol))
    .map((idol, _, array) => {
      const sameColor = array.filter((x) => Idol.colorEqual(x, idol));

      return sameColor.length === 1 ? idol : Idol.merge(sameColor);
    })
    .filter((idol, index, array) => array.findIndex((x) => Idol.colorEqual(x, idol)) === index),
}));

export default group;
