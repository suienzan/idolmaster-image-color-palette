import untypedColorData from '@/colorData.json';
import { IProduction } from './classes/types';
import { IGroup } from './classes/Group';
import Idol from './classes/Idol';

const colorData = untypedColorData as IProduction[];

const group: IGroup[] = colorData.map((production) => ({
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

export default group;
