/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "[e]" }] */
import fs from 'fs';
import {
  both,
  compose,
  curry,
  defaultTo,
  filter,
  flip,
  includes,
  length,
  lt,
  partition,
  path,
  pathOr,
  prop,
  propOr,
} from 'ramda';
import convert, { Element } from 'xml-js';
import { IIdol, IProduction } from '@/classes/types';

const arrayNotEmpty = both(Array.isArray, compose(lt(0), length));

// https://github.com/nashwaan/xml-js/issues/125
// https://github.com/microsoft/TypeScript/issues/33014
const convertToJs = (data: Buffer) => convert.xml2js(data.toString(), {
  ignoreDeclaration: true,
  ignoreInstruction: true,
  ignoreComment: true,
  ignoreCdata: true,
  ignoreDoctype: true,
  trim: true,
}) as Element;

const getIdolElementList: (e: Element) => Element[] = compose(
  defaultTo<Element[]>([]),
  path<Element[]>(['elements', 0, 'elements']),
);

const attrs = ['schema:name', 'schema:alternateName', 'schema:givenName', 'imas:Color'] as const;

type EntryKeys = typeof attrs[number];

type Entry<T = EntryKeys> = [T, T extends 'imas:Color' ? string : Record<string, string>];

interface ElementHasName extends Element {
  name: EntryKeys;
}

const hasName = (e: ElementHasName | Element): e is ElementHasName => !!e.name;

const patch = (production: string) => (elements: Element[]) => elements.reduce((acc, e) => {
  const description: Element[] = propOr([], 'elements')(e);
  const picked = filter(compose(flip(includes)(attrs), propOr('', 'name')))(description);

  const entries: Entry[] = picked.filter(hasName).map((x) => {
    const lang = path<string>(['attributes', 'xml:lang'], x);

    const entry: Entry = lang
      ? [x.name, { [lang]: pathOr<string>('', ['elements', 0, 'text'], x) }]
      : [x.name, pathOr<string>('', ['elements', 0, 'text'], x)];

    return entry;
  });

  const [allNames, subInfo] = partition((x: Entry) => x[0].startsWith('schema:'))(entries);

  const namestring = attrs.find((x) => allNames.some((y) => y[0] === x));

  const names = allNames.filter((x) => x[0] === namestring);

  const nameEntries = names.map((x) => x[1]).flatMap(Object.entries);

  const { ja = '', en, 'imas:Color': color } = Object.fromEntries(nameEntries.concat(subInfo));

  const checkOfficial = (x: string, y: string) => x !== 'CinderellaGirls'
      || ['双葉杏', '安部菜々', '高垣楓', '神崎蘭子', '城ヶ崎美嘉', '諸星きらり'].includes(y);

  if (!color) return acc;

  const idol: IIdol = {
    ja,
    en,
    hex: `#${color}`,
    isOffical: checkOfficial(production, ja),
  };

  return acc.concat(idol);
}, [] as IIdol[]);

const readFile = (production: string): Promise<IProduction> => fs.promises
  .readFile(new URL(`../imasparql/RDFs/${production}.rdf`, import.meta.url).pathname)
  .then((data) => ({
    name: production,
    idols: compose(patch(production), getIdolElementList, convertToJs)(data),
  }));

const productions = ['1stVision', '765MillionStars', 'CinderellaGirls', '283', '876', '961'];

const filterProduction = filter<Record<'idols', IIdol[]>>(compose(arrayNotEmpty, prop('idols')));

// remove optional argument `options?` and do curry
const writeFileSync = curry((file: fs.PathLike, data: string) => fs.writeFileSync(file, data));

Promise.all(productions.map(readFile))
  .then(filterProduction)
  .then(compose(writeFileSync('src/colorData.json'), JSON.stringify));
