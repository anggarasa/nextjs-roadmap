import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProjectBanner } from "@/components/ProjectBanner";
import { UserAvatar } from "@/components/UserAvatar";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

interface ProjectEntity {
  id: string;
  name: string;
  description?: string;
  bannerUrl?: string;
  owner: {
    name: string;
    avatarUrl?: string;
  };
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE";
}

// Fallback project untuk keperluan demo audit Lighthouse & testing offline
const fallbackProjects: Record<string, ProjectEntity> = {
  "proj-enterprise-01": {
    id: "proj-enterprise-01",
    name: "Enterprise Core System Platform",
    description: "Arsitektur skala enterprise yang menghubungkan Next.js App Router dengan Nest.js Core Engine serta performa Web Vitals terakreditasi.",
    bannerUrl: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=1600&auto=format&fit=crop",
    owner: {
      name: "Farhan Coders",
      avatarUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
    },
  },
};

const fallbackTasks: TaskItem[] = [
  {
    id: "task-101-core",
    title: "Optimasi Modern Image Pipeline (next/image)",
    description: "Eliminasi tag <img> polos, penerapan WebP/AVIF dan flag priority untuk memangkas LCP.",
    status: "DONE",
  },
  {
    id: "task-102-font",
    title: "Zero-Blocking Typography (next/font)",
    description: "Self-hosting font Inter dan JetBrains Mono guna menjamin stabilitas visual dan CLS 0.000.",
    status: "DONE",
  },
  {
    id: "task-103-meta",
    title: "Dynamic Metadata & Open Graph Social Cards",
    description: "Penyusunan kartu pratinjau sosial 1200x630 piksel otomatis dari database Nest.js.",
    status: "IN_PROGRESS",
  },
  {
    id: "task-104-site",
    title: "Automated robots.ts & sitemap.ts Discovery",
    description: "Panduan bot mesin pencari dengan crawling deterministik dan isolasi rute privat.",
    status: "DONE",
  },
];

async function getProject(id: string): Promise<ProjectEntity | null> {
  const apiUrl = process.env.NESTJS_API_URL || "http://localhost:3001";
  const apiKey = process.env.INTERNAL_API_KEY || "farhan-secret-key";

  try {
    const res = await fetch(`${apiUrl}/projects/${id}`, {
      headers: {
        "x-api-key": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: String(data.id),
        name: data.name,
        description: data.description,
        bannerUrl: data.bannerUrl,
        owner: data.owner || {
          name: "Farhan Coders",
          avatarUrl: "https://avatars.githubusercontent.com/u/9919?v=4",
        },
      };
    }
  } catch {
    // Backend offline / network error fallback
  }

  // Fallback demo data jika backend belum tersedia
  if (fallbackProjects[id]) {
    return fallbackProjects[id];
  }

  // Jika ID numerik atau format lain pada mode demo, buatkan fallback yang valid
  if (id === "1" || id === "proj-enterprise-01") {
    return fallbackProjects["proj-enterprise-01"];
  }

  return null;
}

async function getProjectTasks(projectId: string): Promise<TaskItem[]> {
  const apiUrl = process.env.NESTJS_API_URL || "http://localhost:3001";
  const apiKey = process.env.INTERNAL_API_KEY || "farhan-secret-key";

  try {
    const res = await fetch(`${apiUrl}/tasks?projectId=${projectId}`, {
      headers: {
        "x-api-key": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((t: any) => ({
          id: String(t.id),
          title: t.title,
          description: t.description || "Tidak ada deskripsi",
          status: t.status || (t.done ? "DONE" : "OPEN"),
        }));
      }
    }
  } catch {
    // Backend offline fallback
  }

  return fallbackTasks;
}

// Langkah 3: Menerapkan Metadata SEO & Open Graph di Halaman Publik
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: "Proyek Tidak Ditemukan",
      description: "Halaman proyek publik yang Anda tuju tidak tersedia.",
    };
  }

  return {
    title: project.name, // Otomatis menjadi: "[Nama Project] | FARHAN CODERS"
    description: project.description || "Detail pengerjaan proyek enterprise tim.",
    openGraph: {
      title: project.name,
      description: project.description || "Detail pengerjaan proyek enterprise tim.",
      url: `/projects/${id}`,
      siteName: "FARHAN CODERS Task Manager",
      images: [
        {
          url: project.bannerUrl || "/images/og-project-banner.png",
          width: 1200,
          height: 630,
          alt: `Cover Proyek: ${project.name}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.description,
    },
  };
}

// Komponen Halaman Publik Detail Proyek
export default async function PublicProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const tasks = await getProjectTasks(id);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigasi Header Sederhana */}
        <nav className="flex items-center justify-between pb-4 border-b border-slate-200" aria-label="Breadcrumb">
          <Link
            href="/dashboard/tasks"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            ← Kembali ke Workspace Dashboard
          </Link>
          <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
            PUBLIC SPECIFICATION
          </span>
        </nav>

        {/* Langkah 1: Mengintegrasikan Asset Gambar Teroptimasi (next/image) */}
        <div className="space-y-6">
          {/* Banner responsif dengan prioritas LCP */}
          <ProjectBanner
            bannerUrl={project.bannerUrl || "/images/default-project-cover.png"}
            title={project.name}
          />

          <div className="flex items-center gap-3">
            <UserAvatar
              src={project.owner.avatarUrl || "https://avatars.githubusercontent.com/u/9919?v=4"}
              name={project.owner.name}
            />
            <div>
              <p className="text-sm font-semibold font-sans text-slate-800">{project.owner.name}</p>
              <p className="text-xs font-sans text-slate-400">Project Maintainer</p>
            </div>
          </div>
        </div>

        {/* Deskripsi Proyek */}
        <section aria-labelledby="project-title" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 id="project-title" className="text-xl font-bold font-sans text-slate-900 mb-2">
            {project.name}
          </h1>
          <p className="text-sm font-sans text-slate-600 leading-relaxed">
            {project.description}
          </p>
        </section>

        {/* Langkah 2: Menyelaraskan Tipografi Sans & Monospace di Komponen Data */}
        <section aria-labelledby="task-list-heading" className="space-y-3">
          <div className="flex justify-between items-center mb-1">
            <h3 id="task-list-heading" className="text-base font-bold font-sans text-slate-900">
              Daftar Tugas Proyek ({tasks.length})
            </h3>
            <span className="text-xs font-mono text-slate-400">Zero-Blocking Layout</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white border border-slate-200 rounded-xl flex justify-between items-center shadow-sm"
              >
                <div>
                  {/* Teks utama menggunakan font-sans */}
                  <h4 className="text-sm font-bold font-sans text-slate-900">{task.title}</h4>
                  <p className="text-xs font-sans text-slate-500">{task.description}</p>
                </div>

                {/* Data ID dan status teknis dikunci menggunakan font-mono */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    ID: {task.id.slice(0, 8)}
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                      task.status === "DONE"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
