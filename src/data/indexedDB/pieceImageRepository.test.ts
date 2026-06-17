import { describe, expect, it, beforeEach } from 'vitest';

import { resetDbForTests } from '@/data/indexedDB/db';
import {
  deletePieceImage,
  getPieceImage,
  listPieceImagesByType,
  savePieceImage,
} from '@/data/indexedDB/pieceImageRepository';

describe('pieceImageRepository', () => {
  beforeEach(async () => {
    await resetDbForTests();
  });

  it('コマ画像を保存して取得できる', async () => {
    const saved = await savePieceImage({
      id: 'lion-1',
      pieceType: 'lion',
      dataUrl: 'data:image/png;base64,abc',
    });

    const found = await getPieceImage('lion-1');

    expect(found).toEqual(saved);
  });

  it('コマ種別で一覧取得できる', async () => {
    await savePieceImage({
      id: 'lion-1',
      pieceType: 'lion',
      dataUrl: 'data:image/png;base64,abc',
    });
    await savePieceImage({
      id: 'chick-1',
      pieceType: 'chick',
      dataUrl: 'data:image/png;base64,def',
    });

    const lions = await listPieceImagesByType('lion');

    expect(lions).toHaveLength(1);
    expect(lions[0]?.id).toBe('lion-1');
  });

  it('コマ画像を削除できる', async () => {
    await savePieceImage({
      id: 'lion-1',
      pieceType: 'lion',
      dataUrl: 'data:image/png;base64,abc',
    });

    await deletePieceImage('lion-1');

    expect(await getPieceImage('lion-1')).toBeUndefined();
  });
});
