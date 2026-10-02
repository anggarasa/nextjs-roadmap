async function getTasks() {
  // Simulasi delay jaringan database/API selama 2 detik
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulasi kondisi error acak untuk menguji error.tsx
  // Ubah menjadi false jika ingin melihat halaman sukses
  const isError = false;
  if (isError) {
    throw new Error("Gagal mengambil data task dari server backend!");
  }

  return [
    { id: 1, title: "Migrasi Database ke PostgreSQL Enterprise", status: "Selesai" },
    { id: 2, title: "Setup Docker Container & Traefik Proxy", status: "Dalam Proses" },
  ];
}

export default async function DashboardPage() {
  const tasks = await getTasks();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Daftar Task Enterprise</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 border-b border-slate-100 flex justify-between items-center">
            <span className="font-medium text-slate-700">{task.title}</span>
            <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-semibold">{task.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
