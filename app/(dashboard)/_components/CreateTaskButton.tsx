"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTaskButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTask = async () => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push("/dashboard/tasks");

    router.refresh();
    setIsSubmitting(false);
  };

  return (
    <button onClick={handleCreateTask} disabled={isSubmitting} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50">
      {isSubmitting ? "Menyimpan..." : "＋ Tambah Task Baru"}
    </button>
  );
}
