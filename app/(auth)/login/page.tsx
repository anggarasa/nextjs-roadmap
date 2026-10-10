export default function LoginPage() {
  return (
    <div className="space-y-4">
      <div className="text-center pb-2">
        <h3 className="text-lg font-semibold text-slate-800">Masuk ke Akun Anda</h3>
        <p className="text-xs text-slate-500 mt-0.5">Sesi Anda belum terautentikasi atau telah berakhir.</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Perusahaan</label>
          <input
            type="email"
            defaultValue="admin@taskmanager.com"
            placeholder="nama@perusahaan.com"
            className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-blue-600 focus:ring-1 focus:ring-blue-600 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
          <input type="password" defaultValue="password123" placeholder="••••••••" className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-blue-600 focus:ring-1 focus:ring-blue-600 transition" />
        </div>
      </div>

      <button type="button" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm hover:shadow">
        Masuk Dashboard
      </button>

      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg text-[11px] text-blue-700 text-center">
        💡 <strong>Mode Pengujian Edge Middleware:</strong> Buka DevTools (F12) → <em>Application</em> → <em>Cookies</em> → Tambahkan <code>access_token</code> untuk membuka proteksi.
      </div>
    </div>
  );
}
