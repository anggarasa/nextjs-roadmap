"use client";

import { useState } from "react";

export function TaskStatusToggle() {
  const [isDone, setIsDone] = useState(false);

  return (
    <button
      onClick={() => setIsDone(!isDone)}
      className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 border ${
        isDone ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
      }`}
    >
      {isDone ? "✓ Completed" : "⏱ In Progress"}
    </button>
  );
}
