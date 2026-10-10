import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WebVitalsReporter } from "@/app/_components/WebVitalsReporter";

// 1. Inisialisasi Font Utama Sans-Serif (Inter)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 2. Inisialisasi Font Monospace (JetBrains Mono)
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Deklarasi Metadata Global Server-Side
export const metadata: Metadata = {
  title: {
    default: "FARHAN CODERS - Task Manager Enterprise",
    template: "%s | FARHAN CODERS",
  },
  description:
    "Sistem manajemen tugas dan kolaborasi tim terintegrasi penuh dengan Nest.js API & Prisma.",
  metadataBase: new URL("https://taskmanager.farhancoders.com"),
  keywords: [
    "Next.js 15",
    "NestJS",
    "TypeScript",
    "Task Manager",
    "Enterprise Dashboard",
    "Prisma ORM",
  ],
  authors: [{ name: "Farhan Coders", url: "https://farhancoders.com" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen">
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  );
}
