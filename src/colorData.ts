import untypedColorData from '@/colorData.json';
import Idol from './classes/Idol';

export default untypedColorData.map((production) => ({
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
