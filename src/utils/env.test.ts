import { describe, expect, it } from 'vitest';

import { getClientEnv } from './env';

describe('getClientEnv', () => {
  it('デフォルトのアプリ名を返す', () => {
    expect(getClientEnv().NEXT_PUBLIC_APP_NAME).toBe('DOUBUTSUSHOGI');
  });
});
