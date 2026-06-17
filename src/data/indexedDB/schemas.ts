import { z } from 'zod';

export const PIECE_TYPES = [
  'lion',
  'elephant',
  'giraffe',
  'chick',
  'chicken',
] as const;

export const pieceTypeSchema = z.enum(PIECE_TYPES);

export type PieceType = z.infer<typeof pieceTypeSchema>;

export const pieceImageSchema = z.object({
  id: z.string().min(1),
  pieceType: pieceTypeSchema,
  dataUrl: z.string().min(1),
  updatedAt: z.number().int().nonnegative(),
});

export type PieceImage = z.infer<typeof pieceImageSchema>;

export const pieceImageInputSchema = pieceImageSchema.omit({ updatedAt: true });

export type PieceImageInput = z.infer<typeof pieceImageInputSchema>;
