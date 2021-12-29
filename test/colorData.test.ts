import { expect, test } from 'vitest';
import { Idol } from '../src/colorData';

test('color', () => {
  const sakuya = new Idol({
    ja: '白瀬咲耶',
    en: 'Sakuya Shirase',
    hex: '#006047',
  });

  expect(sakuya.get('hsl')).toEqual('hsl(164.38,100%,18.82%)');
  expect(sakuya.get('hex')).toEqual('#006047');
});

test('merge', () => {
  const ami = new Idol({
    ja: '双海亜美',
    en: 'Ami Futami',
    hex: '#FFE43F',
  });

  const mami = new Idol({
    ja: '双海真美',
    en: 'Mami Futami',
    hex: '#FFE43F',
  });

  const merged = new Idol({
    ja: '双海亜美 & 双海真美',
    en: 'Ami Futami & Mami Futami',
    hex: '#FFE43F',
  });

  expect(Idol.merge(ami, mami)).toEqual(merged);
});
