import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('DOUBUTSUSHOGI'),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function getClientEnv(): ClientEnv {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  });
}
