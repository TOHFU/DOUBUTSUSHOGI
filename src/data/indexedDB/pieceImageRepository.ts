import { getDb } from '@/data/indexedDB/db';
import {
  pieceImageInputSchema,
  pieceImageSchema,
  type PieceImage,
  type PieceImageInput,
  type PieceType,
} from '@/data/indexedDB/schemas';

export async function savePieceImage(
  input: PieceImageInput,
): Promise<PieceImage> {
  const parsedInput = pieceImageInputSchema.parse(input);
  const pieceImage = pieceImageSchema.parse({
    ...parsedInput,
    updatedAt: Date.now(),
  });
  const db = await getDb();

  await db.put('pieceImages', pieceImage);

  return pieceImage;
}

export async function getPieceImage(
  id: string,
): Promise<PieceImage | undefined> {
  const db = await getDb();
  const pieceImage = await db.get('pieceImages', id);

  return pieceImage ? pieceImageSchema.parse(pieceImage) : undefined;
}

export async function listPieceImagesByType(
  pieceType: PieceType,
): Promise<PieceImage[]> {
  const db = await getDb();
  const pieceImages = await db.getAllFromIndex(
    'pieceImages',
    'pieceType',
    pieceType,
  );

  return pieceImages.map((pieceImage) => pieceImageSchema.parse(pieceImage));
}

export async function deletePieceImage(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('pieceImages', id);
}
