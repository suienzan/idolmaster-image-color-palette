import fs from 'fs';
import { path } from 'ramda';
import convert, { Element } from 'xml-js';
import { IIdol } from './colorData';

const productions = ['1stVision', 'CinderellaGirls', '765MillionStars', '283', '876', '961'];

const getNameByLang = (names: Element[], lang: string): string | undefined => {
  const element = names.find((x) => path(['attributes', 'xml:lang'], x) === lang);
  return path(['elements', 0, 'text'], element);
};

const readFile = (production: string) => fs.promises
  .readFile(new URL(`../imasparql/RDFs/${production}.rdf`, import.meta.url).pathname)
  .then((data) => ({
    name: production,
    idols: convert
      .xml2js(data.toString(), {
        ignoreDeclaration: true,
        ignoreInstruction: true,
        ignoreComment: true,
        ignoreCdata: true,
        ignoreDoctype: true,
        trim: true,
      })
      .elements[0].elements.reduce((aac: IIdol[], { elements }: Element) => {
        const nameKeyList = ['schema:name', 'schema:alternateName', 'schema:givenName'];
        if (!elements) return aac;

        const preferedName = nameKeyList.find((x) => elements.find((y) => y.name === x));

        const names = elements.filter((y) => y.name === preferedName);

        const ja = getNameByLang(names, 'ja');
        const en = getNameByLang(names, 'en');
        const colorElement = elements.find((y) => y.name === 'imas:Color');
        const color = path(['elements', 0, 'text'], colorElement);

        return !(ja && color)
          ? aac
          : aac.concat([
            {
              ja,
              en,
              hex: `#${color}`,
            },
          ]);
      }, []),
  }));

Promise.all(productions.map(readFile))
  .then((array) => array.filter(({ idols }) => Array.isArray(idols) && idols.length > 0))
  .then((json) => {
    fs.writeFileSync('colorData.json', JSON.stringify(json, null, 2));
  });
