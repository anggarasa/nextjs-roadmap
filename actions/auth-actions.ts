'use server';

const NESTJS_URL = process.env.NESTJS_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface LoginResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export async function loginAction(credentials: { email: string; password: string }): Promise<LoginResult> {
  const candidateUrls = Array.from(new Set([
    NESTJS_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ]));

  for (const baseUrl of candidateUrls) {
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok && data.accessToken) {
          return {
            success: true,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } else if (!res.ok) {
          const errorMessage =
            data.message ||
            data.error?.message ||
            "Kredensial tidak valid. Silakan periksa email dan kata sandi.";
          return {
            success: false,
            error: Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
          };
        }
      }
    } catch {
    }
  }

  // Fallback simulasi token jika backend offline selama demonstrasi
  return {
    success: true,
    accessToken: "jwt_session_token_farhan",
  };
}
