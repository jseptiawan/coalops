"use client";
import { useI18n } from "@/lib/i18n";
import { executiveSummary } from "@/lib/seed";
import { FileText, Download, BarChart3, Calculator, Briefcase, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const { t, lang } = useI18n();
  return (
    <div className="space-y-3 max-w-[1200px] mx-auto">
      <header className="bg-white rounded-lg border border-coal-200 p-4">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <FileText size={18} className="text-amber-600" />
          {t("nav.reports")}
        </h1>
        <p className="text-xs text-coal-500 mt-1">
          {lang === "id" ? "Laporan harian/bulanan, ekspor Excel/PDF, dan ringkasan eksekutif bilingual." : "Daily/monthly reports, Excel/PDF exports, and bilingual executive summary."}
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-3">
        <ReportCard
          icon={<FileText size={18} />}
          title={lang === "id" ? "Laporan Harian" : "Daily Report"}
          desc={lang === "id" ? "KPI harian, hari ini vs kemarin, MTD, YTD, LTD. Termasuk K3, produksi, alat, biaya." : "Daily KPIs, today vs yesterday, MTD, YTD, LTD. Includes safety, production, equipment, costs."}
          href="/"
        />
        <ReportCard
          icon={<BarChart3 size={18} />}
          title={lang === "id" ? "Laporan Bulanan Produksi" : "Monthly Production Report"}
          desc={lang === "id" ? "S-curve per tahap, analisis varians, komparasi YoY." : "S-curve per stage, variance analysis, YoY comparison."}
          href="/module/17"
        />
        <ReportCard
          icon={<Calculator size={18} />}
          title={lang === "id" ? "Laporan Penjualan / DMO / Royalti" : "Sales / DMO / Royalty Report"}
          desc={lang === "id" ? "Realisasi per kontrak, kepatuhan DMO, perhitungan royalti untuk pelaporan ESDM." : "Realization per contract, DMO compliance, royalty computation for ESDM reporting."}
          href="/module/15"
        />
        <ReportCard
          icon={<Briefcase size={18} />}
          title={lang === "id" ? "Pernyataan Neraca Batubara" : "Coal Account Statement"}
          desc={lang === "id" ? "Neraca massa, kualitas, dan nilai bulanan. Pit-to-port." : "Monthly mass, quality, and value balance. Pit-to-port."}
          href="/module/17"
        />
        <ReportCard
          icon={<Sparkles size={18} />}
          title={lang === "id" ? "Ringkasan Eksekutif (Bilingual)" : "Executive Summary (Bilingual)"}
          desc={lang === "id" ? "Sintesis AI dari semua modul. Output 1 halaman EN+ID." : "AI-synthesized from all modules. 1-page EN+ID output."}
          href="/module/19"
        />
        <ReportCard
          icon={<Download size={18} />}
          title={lang === "id" ? "Ekspor Mentah (CSV / Excel)" : "Raw Export (CSV / Excel)"}
          desc={lang === "id" ? "Setiap tabel dapat diunduh sebagai CSV. Template impor bilingual." : "Every table downloadable as CSV. Bilingual import templates."}
          href="/admin"
        />
      </div>

      <section className="bg-coal-50 border border-coal-200 rounded-lg p-4">
        <h2 className="text-sm font-bold mb-2">{lang === "id" ? "Pratinjau Ringkasan" : "Summary Preview"}</h2>
        <p className="text-sm text-coal-700">{executiveSummary.headline}</p>
      </section>
    </div>
  );
}

function ReportCard({ icon, title, desc, href }: { icon: React.ReactNode; title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg border border-coal-200 p-4 hover:shadow-md transition flex items-start gap-3"
    >
      <div className="w-9 h-9 rounded bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-[11px] text-coal-500 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}
