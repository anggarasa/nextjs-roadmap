// components/ProjectBanner.tsx
import Image from "next/image";

interface ProjectBannerProps {
  bannerUrl: string;
  title: string;
}

export function ProjectBanner({ bannerUrl, title }: ProjectBannerProps) {
  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-6">
      <Image
        src={bannerUrl}
        alt={`Cover Project ${title}`}
        fill
        priority // Menjadikan gambar sebagai prioritas LCP (Largest Contentful Paint)
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover"
      />
      {/* Overlay gradien untuk keterbacaan teks */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
        <h2 className="text-xl font-bold text-white drop-shadow-sm">{title}</h2>
      </div>
    </div>
  );
}
