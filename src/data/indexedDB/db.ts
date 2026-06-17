import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

import type { PieceImage } from '@/data/indexedDB/schemas';

export interface DoubutsuShogiDB extends DBSchema {
  pieceImages: {
    key: string;
    value: PieceImage;
    indexes: { pieceType: PieceTypeIndex };
  };
}

type PieceTypeIndex = PieceImage['pieceType'];

const DB_NAME = 'doubutsushogi';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<DoubutsuShogiDB>> | undefined;

export async function closeDb(): Promise<void> {
  if (!dbPromise) {
    return;
  }

  const db = await dbPromise;
  db.close();
  dbPromise = undefined;
}

export function getDb(): Promise<IDBPDatabase<DoubutsuShogiDB>> {
  if (!dbPromise) {
    dbPromise = openDB<DoubutsuShogiDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pieceImages')) {
          const store = db.createObjectStore('pieceImages', { keyPath: 'id' });
          store.createIndex('pieceType', 'pieceType');
        }
      },
    });
  }

  return dbPromise;
}

export async function resetDbForTests(): Promise<void> {
  if (typeof indexedDB === 'undefined') {
    return;
  }

  await closeDb();

  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
