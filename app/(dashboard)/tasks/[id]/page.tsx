import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

const fallbackTasks: Record<string, any> = {
  "1": {
    id: 1,
    title: "Migrasi Database Nest.js",
    description: "Detail pengerjaan tugas proyek migrasi database Nest.js dan Prisma ORM.",
    status: "IN_PROGRESS",
    done: false,
  },
  "2": {
    id: 2,
    title: "Setup Docker Container & Redis Cache",
    description: "Infrastruktur container untuk caching enterprise.",
    status: "DONE",
    done: true,
  },
};

// Helper fetch data dari backend Nest.js (Otomatis dideduplikasi oleh Next.js)
async function getTask(id: string) {
  const token = process.env.INTERNAL_API_KEY || "farhan-secret-key";
  const apiUrl = process.env.NESTJS_API_URL || "http://localhost:3001";

  try {
    const res = await fetch(`${apiUrl}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": token,
      },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline / network error
  }

  // Fallback demo tasks jika backend offline atau ID tertentu
  if (fallbackTasks[id]) {
    return fallbackTasks[id];
  }

  return null;
}

// 1. Fungsi Dinamis Penghasil Metadata SEO Server-Side
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const task = await getTask(id);

  // Fallback jika task tidak ditemukan di database
  if (!task) {
    return {
      title: "Tugas Tidak Ditemukan",
      description: "Data tugas yang Anda cari tidak tersedia di sistem.",
    };
  }

  // Menghasilkan metadata lengkap dengan Open Graph & Twitter Cards
  return {
    title: task.title, // Otomatis disandingkan template: "[Title] | FARHAN CODERS"
    description: task.description || `Detail pengerjaan tugas proyek ID ${id}`,
    openGraph: {
      title: task.title,
      description: task.description || "Detail pengerjaan tugas proyek tim",
      url: `/dashboard/tasks/${id}`,
      siteName: "FARHAN CODERS Task Manager",
      images: [
        {
          url: "/images/og-task-banner.png", // Dikonversi jadi absolut via metadataBase
          width: 1200,
          height: 630,
          alt: `Pratinjau Tugas: ${task.title}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: task.title,
      description: task.description || "Detail pengerjaan tugas proyek tim",
    },
  };
}

// 2. Komponen Halaman Utama
export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  const task = await getTask(id);

  if (!task) {
    notFound();
  }

  const status = task.status || (task.done ? "DONE" : "IN_PROGRESS");

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard/tasks"
        className="text-xs font-semibold text-blue-600 hover:underline"
      >
        ← Kembali ke Daftar Task
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">
          STATUS: {status}
        </span>
        <h1 className="text-2xl font-bold font-sans text-slate-900">{task.title}</h1>
        <p className="text-sm font-sans text-slate-600 leading-relaxed">
          {task.description || "Tidak ada deskripsi detail untuk tugas ini."}
        </p>
      </div>
    </div>
  );
}
