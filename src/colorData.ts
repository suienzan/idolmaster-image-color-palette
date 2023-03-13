import untypedColorData from '@/colorData.json';
import { IProduction } from './classes/types';
import { IGroup } from './classes/Group';
import Idol from './classes/Idol';

const colorData = untypedColorData as IProduction[];

const group: IGroup[] = colorData.map((production) => ({
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
