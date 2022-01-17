/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "[e es l]" }] */
import fs from 'fs';
import {
  both,
  compose,
  curry,
  defaultTo,
  equals,
  filter,
  find,
  flip,
  length,
  lt,
  map,
  path,
  prop,
  propEq,
  reduce,
  uncurryN,
} from 'ramda';
import convert, { Element } from 'xml-js';
import { IIdol } from '@/classes/types';

const nameKeyList = ['schema:name', 'schema:alternateName', 'schema:givenName'];

const getNameElements = (es: Element[]) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  map((k) => filter(propEq<string>('name', k), es), nameKeyList);

const arrayNotEmpty = both(Array.isArray, compose(lt(0), length));

const getFirstNotEmpty = find<Element[]>(arrayNotEmpty);

const getPreferedName = compose(defaultTo<Element[]>([]), getFirstNotEmpty, getNameElements);

const getLang = path<string>(['attributes', 'xml:lang']);

const unflipped = (l: string) => find(compose(equals<string | undefined>(l), getLang));
const uncurried: (l: string, es: Element[]) => Element = uncurryN(2, unflipped);
const findElementByLang = flip(uncurried);

const getName: (e: Element) => string | undefined = path<string>(['elements', 0, 'text']);

const getByLang = curry(compose(getName, findElementByLang));

const convertToJs = (data: Buffer) => convert.xml2js(data.toString(), {
  ignoreDeclaration: true,
  ignoreInstruction: true,
  ignoreComment: true,
  ignoreCdata: true,
  ignoreDoctype: true,
  trim: true,
}) as Element;

const reducer = (aac: IIdol[], { elements }: Element) => {
  if (!elements) return aac;

  const names = getPreferedName(elements);

  const getNameByLang = getByLang(names);

  const ja = getNameByLang('ja');
  const en = getNameByLang('en');
  const colorElement = elements.find(propEq<string>('name', 'imas:Color'));
  const color = path<string>(['elements', 0, 'text'], colorElement);

  if (!ja || !color) return aac;

  const idol: IIdol = {
    ja,
    en,
    hex: `#${color}`,
  };

  return aac.concat(idol);
};

const patch: (e: Element) => IIdol[] = compose(
  reduce(reducer, []),
  defaultTo<Element[]>([]),
  path<Element[]>(['elements', 0, 'elements']),
);

const readFile = (production: string) => fs.promises
  .readFile(new URL(`../imasparql/RDFs/${production}.rdf`, import.meta.url).pathname)
  .then((data) => ({
    name: production,
    idols: compose(patch, convertToJs)(data),
  }));

const productions = ['1stVision', '765MillionStars', '283', '876', '961', 'CinderellaGirls'];

const filterProduction = filter<Record<'idols', IIdol[]>>(compose(arrayNotEmpty, prop('idols')));

// remove optional argument `options?` and do curry
const writeFileSync = curry((file: fs.PathLike, data: string) => fs.writeFileSync(file, data));

Promise.all(productions.map(readFile))
  .then(filterProduction)
  .then(compose(writeFileSync('src/colorData.json'), JSON.stringify));
