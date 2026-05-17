import { z } from 'zod';

const envSchema = z.object({
  API_URL: z.string().min(1),
});

const result = envSchema.safeParse({
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000',
});

if (!result.success) {
  throw new Error(`[env] Variables de entorno inválidas: ${result.error.message}`);
}

export const env = result.data;
