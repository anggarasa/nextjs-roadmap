export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-slate-800/10">
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-widest font-bold text-blue-600">Enterprise Access</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">TaskManager Pro</h2>
        </div>
        {children}
      </div>
    </div>
  );
}
