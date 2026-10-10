"use client";

import { updateTaskStatus } from "@/actions/task-actions";
import { useOptimistic, useTransition } from "react";

export function TaskStatusButton({ taskId, done }: { taskId: string | number; done: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticDone, setOptimisticDone] = useOptimistic(done, (_current, next: boolean) => next);

  const nextDone = !optimisticDone;

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          setOptimisticDone(nextDone);
          await updateTaskStatus(taskId, nextDone);
        });
      }}
      disabled={isPending}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono border transition-all duration-150 disabled:opacity-50 cursor-pointer ${
        optimisticDone ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
      }`}
    >
      {isPending ? (
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
          Updating...
        </span>
      ) : optimisticDone ? (
        "✓ Status: DONE"
      ) : (
        "⏱ Status: OPEN"
      )}
    </button>
  );
}
