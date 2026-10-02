export default function TasksPage() {
  const taskList = [
    {
      id: 1,
      title: "Membuat Desain UI",
      priority: "High",
    },
    {
      id: 2,
      title: "Setup Database",
      priority: "Urgent",
    },
    {
      id: 3,
      title: "Integrasi API",
      priority: "Medium",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Daftar Task Enterprise</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola dan pantau prioritas tugas tim engineering.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {taskList.map((task) => (
          <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <span className="font-medium text-slate-800 text-sm">{task.title}</span>
            <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono">{task.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
