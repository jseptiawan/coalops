"use client";
import { useI18n } from "@/lib/i18n";
import { executiveSummary } from "@/lib/seed";
import { FileText, Sparkles } from "lucide-react";
import Link from "next/link";

export function ExecSummaryPreview() {
  const { t, lang } = useI18n();
  const s = executiveSummary;
  return (
    <div className="bg-gradient-to-br from-coal-950 to-coal-800 text-coal-50 rounded-lg p-4">
      <header className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          {t("execSummary.preview")}
        </h2>
        <span className="text-[10px] text-coal-300 uppercase tracking-wider">
          {s.period} · {s.approvedBy}
        </span>
      </header>
      <p className="text-sm font-semibold text-amber-200 leading-snug">
        {s.headline}
      </p>
      <p className="text-[11px] text-coal-300 mt-2 line-clamp-3">
        {s.sections.production}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Link
          href="/module/19"
          className="text-[11px] px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-coal-950 font-semibold"
        >
          {lang === "id" ? "Buka Ringkasan" : "Open Summary"}
        </Link>
        <Link
          href="/reports"
          className="text-[11px] px-2.5 py-1 rounded border border-coal-600 hover:bg-coal-700"
        >
          {lang === "id" ? "Laporan" : "Reports"}
        </Link>
        <span className="ml-auto text-[10px] text-coal-400">
          {t("execSummary.noApiFallback")}
        </span>
      </div>
    </div>
  );
}
