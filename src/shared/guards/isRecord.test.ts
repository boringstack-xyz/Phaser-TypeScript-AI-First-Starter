import { describe, expect, it } from 'vitest';

import { isRecord } from './isRecord.js';

describe('isRecord', () => {
  it('accepts plain objects', () => {
    expect(isRecord({ a: 1 })).toBe(true);
  });

  it('rejects arrays', () => {
    expect(isRecord([])).toBe(false);
    expect(isRecord(['x'])).toBe(false);
  });

  it('rejects null and primitives', () => {
    expect(isRecord(null)).toBe(false);
    expect(isRecord('obj')).toBe(false);
    expect(isRecord(1)).toBe(false);
  });
});
