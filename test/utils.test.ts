import { removePrefix } from '@/utils';
import { expect, test } from 'vitest';

test('remove prefix', () => {
  expect(removePrefix('#FBFAFA')).toBe('FBFAFA');
  expect(removePrefix('hsl(260,100%,94.12%)')).toBe('260,100%,94.12%');
  expect(removePrefix('rgb(235,225,255)')).toBe('235,225,255');
});
