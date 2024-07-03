import '@total-typescript/ts-reset';

import convert, { type Element } from 'xml-js';
import { path, propEq, pathEq } from 'ramda';
import fs from 'node:fs';
import { type IdolObject } from './classes/types';

const flatElement = (element: Element): Element | Element[] => {
  const { name, elements } = element;

  return elements && name && ['rdf:RDF'].includes(name) ? elements.flatMap(flatElement) : element;
};

const purgeUselessAttributes = (element: Element) =>
  (element.elements ?? []).filter(
    (x) =>
      Boolean(x.name?.toLowerCase().includes('name'))
      || Boolean(x.name?.toLowerCase().includes('color')),
  );

const getElementText = path<string>(['elements', 0, 'text']);

const getName = (lang: 'ja' | 'en') => (elements: Element[]) => {
  const nameAttributes = ['schema:name', 'schema:alternateName', 'schema:givenName'];

  const localeElement = elements.filter(pathEq(['attributes', 'xml:lang'], lang));

  return nameAttributes
    .map((x) => localeElement.find(propEq('name' as string, x)))
    .map(getElementText)
    .find(Boolean);
};

const patch = (elements: Element[]) => {
  const colorElement = elements.find(propEq('name' as string, 'imas:Color'));
  const color = getElementText(colorElement);
  const ja = getName('ja')(elements);

  if (!color || !ja) {
    return undefined;
  }

  return { ja, en: getName('en')(elements), hex: `#${color}` satisfies `#${string}` };
};

const cinderellaGirlsOfficiallList = new Set([
  'ナターリア',
  '双葉杏',
  '城ヶ崎美嘉',
  '安部菜々',
  '桐生つかさ',
  '的場梨沙',
  '神崎蘭子',
  '諸星きらり',
  '高垣楓',
]);

const checkOfficial = (production: string, idolName: string) =>
  !['CinderellaGirls', 'Gakuen'].includes(production) || cinderellaGirlsOfficiallList.has(idolName);

const patchOfficial = (production: string) => (idol: IdolObject) => ({
  ...idol,
  isOffical: checkOfficial(production, idol.ja),
});

// https://github.com/nashwaan/xml-js/issues/125
// https://github.com/microsoft/TypeScript/issues/33014
const convertToJs = (data: Buffer) =>
  convert.xml2js(data.toString(), {
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreComment: true,
    ignoreCdata: true,
    ignoreDoctype: true,
    trim: true,
  }) as Element;

const readFile = async (production: string): Promise<{ name: string; idols: Element }> =>
  fs.promises
    .readFile(new URL(`../imasparql/RDFs/${production}.rdf`, import.meta.url).pathname)
    .then((data) => ({
      name: production,
      idols: convertToJs(data),
    }));

const productions = [
  '1stVision',
  '765MillionStars',
  'CinderellaGirls',
  '283',
  '876',
  '961',
  'Gakuen',
];

const data = await Promise.all(productions.map(readFile));

const patchedData = data.map(({ name, idols }) => ({
  name,
  idols: (idols.elements ?? [])
    .flatMap(flatElement)
    .map(purgeUselessAttributes)
    .map(patch)
    .filter(Boolean)
    .map(patchOfficial(name)),
}));

fs.writeFileSync('src/colorData.json', JSON.stringify(patchedData));
