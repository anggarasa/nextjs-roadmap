export default function RegisterPage() {
  return (
    <div className="space-y-4 max-w-sm mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold text-slate-800">Daftar Akun Baru</h3>
      <input type="email" placeholder="nama@perusahaan.com" className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-blue-600" />
      <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition">Daftar</button>
    </div>
  );
}
