"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/Button";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} variant="primary" size="md" className="w-full">
      {pending ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Menyimpan ke Nest.js...</span>
        </>
      ) : (
        "Simpan & Tambah Task"
      )}
    </Button>
  );
}
