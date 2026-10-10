import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams;
  const from = resolvedParams?.from;

  return (
    <Suspense fallback={<div className="py-8 text-center text-sm text-slate-500 animate-pulse">Memuat formulir login...</div>}>
      <LoginForm initialFrom={from} />
    </Suspense>
  );
}
