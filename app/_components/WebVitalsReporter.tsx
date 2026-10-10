"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
  // Mendengarkan telemetri Core Web Vitals secara pasif
  useReportWebVitals((metric) => {
    // Tampilkan di konsol browser saat masa pengembangan atau staging
    console.log(
      `%c[Web Vitals] ${metric.name}:`,
      "color: #2563eb; font-weight: bold;",
      Math.round(metric.value),
      `(${metric.rating})`
    );

    // Opsi Transmisi Non-Blocking ke endpoint analitik backend (misal: Nest.js / telemetry API)
    // if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    //   navigator.sendBeacon("/api/telemetry", JSON.stringify(metric));
    // }
  });

  return null; // Komponen utilitas murni tanpa elemen visual
}
