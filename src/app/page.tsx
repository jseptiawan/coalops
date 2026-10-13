"use client";
import { SafetyRecap } from "@/components/SafetyRecap";
import { SupportKPIStrip } from "@/components/SupportKPIStrip";
import { ProcessChain } from "@/components/ProcessChain";
import { StandardRecapTable } from "@/components/StandardRecapTable";
import { TopRisksPanel } from "@/components/TopRisksPanel";
import { TraceBack } from "@/components/TraceBack";
import { ExecSummaryPreview } from "@/components/ExecSummaryPreview";
import { useI18n } from "@/lib/i18n";
import { initInfo } from "@/lib/seed";

export default function HomePage() {
  const { t, lang } = useI18n();
  return (
    <div className="space-y-3 max-w-[1600px] mx-auto">
      {/* Onboarding info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span className="font-semibold text-amber-800">
          {lang === "id" ? "Onboarding mid-life" : "Mid-life Onboarding"}
        </span>
        <span className="text-amber-700">
          {lang === "id" ? "Cut-off" : "Cutoff"}: {initInfo.onboardingCutoff} · {lang === "id" ? "Mulai tambang" : "Mine start"}: {initInfo.mineStart}
        </span>
        <span className="ml-auto text-[10px] text-amber-600">
          {lang === "id" ? "Data sebelum cut-off ditampilkan sebagai 'Tidak ada data'" : "Data before cutoff shown as 'No data'"}
        </span>
      </div>

      {/* 1. SAFETY FIRST */}
      <SafetyRecap />

      {/* 2. Support KPI Strip */}
      <SupportKPIStrip />

      {/* 3. Process Chain + Top Risks side-by-side */}
      <div className="grid lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <ProcessChain />
        </div>
        <div>
          <TopRisksPanel />
        </div>
      </div>

      {/* 4. Recap Table */}
      <StandardRecapTable />

      {/* 5. Trace Back */}
      <TraceBack />

      {/* 6. Executive Summary Preview */}
      <ExecSummaryPreview />
    </div>
  );
}
