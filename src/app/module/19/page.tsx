"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { executiveSummary, dashboardKPIs } from "@/lib/seed";
import { Sparkles, Check, Edit, Download, Languages } from "lucide-react";
import { useState } from "react";

const sectionKey: { key: keyof typeof executiveSummary.sections; labelKey: string }[] = [
  { key: "safety", labelKey: "execSummary.safety" },
  { key: "production", labelKey: "execSummary.production" },
  { key: "quality", labelKey: "execSummary.quality" },
  { key: "environment", labelKey: "execSummary.environment" },
  { key: "commercial", labelKey: "execSummary.commercial" },
  { key: "cost", labelKey: "execSummary.cost" },
  { key: "coalAccount", labelKey: "execSummary.coalAccount" },
  { key: "bottleneck", labelKey: "execSummary.bottleneck" },
  { key: "equipment", labelKey: "execSummary.equipment" },
  { key: "hr", labelKey: "execSummary.hr" },
  { key: "dataQuality", labelKey: "execSummary.dataQuality" },
  { key: "risks", labelKey: "execSummary.risks" },
  { key: "conclusions", labelKey: "execSummary.conclusions" },
];

export default function Page() {
  const { t, lang } = useI18n();
  const [viewLang, setViewLang] = useState<"en" | "id">(lang);
  const [editing, setEditing] = useState(false);
  const s = executiveSummary;

  return (
    <ModulePage
      moduleKey="m19"
      moduleNumber={19}
      owner={lang === "id" ? "Admin / GM (manual review & approve); auto-generated harian 06:00 WIB" : "Admin / GM (manual review & approve); auto-generated daily 06:00 WIB"}
      description={
        lang === "id"
          ? "Ringkasan eksekutif & kesimpulan yang disintesis AI dari SEMUA modul untuk periode yang dipilih (Daily/MTD/YTD), dihasilkan dalam Bahasa Inggris dan Indonesia. Mesin: adaptor LLM pluggable (Claude, OpenAI, atau self-hosted; configurable). Jika tidak ada API, fallback ke mesin template berbasis aturan."
          : "AI-composed executive summary and conclusions synthesizing ALL modules for the selected period (Daily/MTD/YTD), produced in English and Indonesian. Engine: pluggable LLM adapter (Claude, OpenAI, or self-hosted; configurable). If no API is configured, fallback to deterministic rule-based template engine."
      }
    >
      {/* Top bar */}
      <section className="bg-gradient-to-br from-coal-950 to-coal-800 text-coal-50 rounded-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-[10px] uppercase tracking-wider">
              <Sparkles size={12} /> {t("execSummary.headline")}
            </div>
            <h2 className="text-base font-bold mt-1 text-amber-200 leading-snug max-w-3xl">
              {s.headline}
            </h2>
            <div className="text-[11px] text-coal-300 mt-2">
              {s.period} · {lang === "id" ? "Disetujui oleh" : "Approved by"} {s.approvedBy} · {s.generatedAt}
            </div>
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex items-center gap-1 bg-coal-800 rounded p-0.5">
              <button
                onClick={() => setViewLang("en")}
                className={`px-2 py-1 rounded ${viewLang === "en" ? "bg-amber-500 text-coal-950 font-bold" : ""}`}
              >
                EN
              </button>
              <button
                onClick={() => setViewLang("id")}
                className={`px-2 py-1 rounded ${viewLang === "id" ? "bg-amber-500 text-coal-950 font-bold" : ""}`}
              >
                ID
              </button>
            </div>
            <button className="px-2 py-1 rounded bg-amber-500 text-coal-950 font-semibold flex items-center gap-1 justify-center">
              <Sparkles size={12} /> {t("execSummary.generate")}
            </button>
            <button className="px-2 py-1 rounded border border-coal-600 hover:bg-coal-700 flex items-center gap-1 justify-center">
              <Edit size={12} /> {editing ? (lang === "id" ? "Simpan" : "Save") : (lang === "id" ? "Sunting" : "Edit")}
            </button>
            <button className="px-2 py-1 rounded border border-coal-600 hover:bg-coal-700 flex items-center gap-1 justify-center">
              <Download size={12} /> PDF
            </button>
          </div>
        </div>

        {/* Data coverage */}
        <div className="mt-3 pt-3 border-t border-coal-700">
          <div className="text-[10px] uppercase text-coal-300 tracking-wider mb-1">
            {t("execSummary.dataCoverage")}
          </div>
          <div className="flex flex-wrap gap-1">
            {["M0","M1","M2","M4","M5","M6","M7","M8","M9","M10","M11","M12","M13","M14","M15","M16","M17","M18"].map((m) => (
              <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-coal-700 text-emerald-300 font-semibold">
                {m} ✓
              </span>
            ))}
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300">
              M3 ({lang === "id" ? "tidak aktif" : "not active"})
            </span>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <ol className="space-y-3 list-decimal pl-5">
          {sectionKey.map((sec, i) => (
            <li key={sec.key} className="marker:font-bold marker:text-coal-400">
              <div className="font-semibold text-coal-800 text-sm">{t(sec.labelKey)}</div>
              <p className="text-xs text-coal-700 leading-relaxed mt-0.5">
                {s.sections[sec.key]}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-4 pt-3 border-t border-coal-200 text-[11px] text-coal-500 flex items-center gap-2">
          <Check size={12} className="text-emerald-600" />
          {t("execSummary.signoff")}: {s.period} · {lang === "id" ? "dihasilkan" : "generated"} {s.generatedAt} · {lang === "id" ? "disetujui" : "approved"} {s.approvedBy}
        </div>
      </section>
    </ModulePage>
  );
}
