// lib/env.ts
import { z } from "zod";

// 1. Deklarasi kontrak skema konfigurasi lingkungan
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEST_API_URL: z.string().url("NEST_API_URL wajib berupa URL valid"),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET wajib minimal 32 karakter demi keamanan"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL wajib berupa URL valid"),
});

// 2. Evaluasi proses validasi terhadap process.env
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ [ENV ERROR] Konfigurasi Variabel Lingkungan Tidak Valid:"
  );
  console.error(parsedEnv.error.flatten().fieldErrors);
  throw new Error(
    "Invalid Environment Variables. Kompilasi build dihentikan demi keamanan sistem."
  );
}

// 3. Ekspor objek env tervalidasi dengan autocomplete TypeScript murni
export const env = parsedEnv.data;
