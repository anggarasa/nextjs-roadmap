export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest font-bold text-blue-500">Enterprise Access</span>
          <h1 className="text-2xl font-bold text-white mt-1">TaskManager Pro</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
