"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { qualitySamples, shipments } from "@/lib/seed";
import { Beaker, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Page() {
  const { t, lang } = useI18n();
  const offSpec = shipments.filter((s) => s.cvGAR < s.specCV);

  return (
    <ModulePage
      moduleKey="m14"
      moduleNumber={14}
      owner={lang === "id" ? "Kepala QA/QC" : "QA/QC Dept Head"}
      description={
        lang === "id"
          ? "Spesifikasi produk per pelanggan/kontrak (CV, TM, IM, Ash, TS, VM, sizing, HGI) dengan batas min/maks dan ambang penalti/penolakan. Sampling & chain of custody. Entry hasil lab. Kualitas per lokasi (pit/seam, ROM, stockpile, tongkang). Rencana blending vs aktual. Kepatuhan tongkang: PASS/FAIL per parameter. Rekonsiliasi kualitas batubara. Tongkang di luar spec otomatis membuat RISIKO yang disarankan (M18)."
          : "Product specification per customer/contract (CV, TM, IM, Ash, TS, VM, sizing, HGI) with min/max limits and penalty/rejection thresholds. Sampling & chain of custody. Lab results entry. Quality by location (pit/seam, ROM, stockpile, barge). Blending plan vs actual. Barge compliance: PASS/FAIL per parameter. Coal quality reconciliation. Off-spec barge auto-creates a SUGGESTED RISK (M18)."
      }
    >
      <div className="grid md:grid-cols-4 gap-2">
        <KPI label={lang === "id" ? "Sampel hari ini" : "Samples today"} value={qualitySamples.length.toString()} />
        <KPI label={lang === "id" ? "Kepatuhan spec" : "Spec compliance"} value="92%" tone="good" />
        <KPI label={lang === "id" ? "Tongkang off-spec" : "Off-spec barges"} value={offSpec.length.toString()} tone="bad" />
        <KPI label={lang === "id" ? "Lab terverifikasi" : "Labs verified"} value="3 / 3" />
      </div>

      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200 flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Beaker size={14} className="text-amber-600" />
            {lang === "id" ? "Hasil Lab & Sampel" : "Lab Results & Samples"}
          </h2>
          <button className="text-[11px] px-2 py-1 rounded bg-amber-500 text-coal-950 font-semibold">+ {lang === "id" ? "Sampel Baru" : "New Sample"}</button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">ID</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Lokasi" : "Location"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Tanggal" : "Date"}</th>
                <th className="px-3 py-2 text-right font-semibold">CV (GAR)</th>
                <th className="px-3 py-2 text-right font-semibold">TM %</th>
                <th className="px-3 py-2 text-right font-semibold">Ash %</th>
                <th className="px-3 py-2 text-right font-semibold">TS %</th>
                <th className="px-3 py-2 text-center font-semibold">{lang === "id" ? "Status" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {qualitySamples.map((s) => (
                <tr key={s.id} className={`border-t border-coal-100 ${!s.pass ? "bg-red-50/50" : ""}`}>
                  <td className="px-3 py-2 font-mono">{s.id}</td>
                  <td className="px-3 py-2 font-semibold">{s.location}</td>
                  <td className="px-3 py-2">{s.date}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold">{s.cvGAR.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{s.tm.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{s.ash.toFixed(1)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{s.ts.toFixed(2)}</td>
                  <td className="px-3 py-2 text-center">
                    {s.pass ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                        <CheckCircle2 size={10} /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                        <AlertTriangle size={10} /> FAIL
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold mb-2">{lang === "id" ? "Spesifikasi Kontrak (Ringkasan)" : "Contract Specs (Summary)"}</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-coal-100 text-coal-600">
              <th className="px-3 py-2 text-left font-semibold">Contract</th>
              <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Pelanggan" : "Customer"}</th>
              <th className="px-3 py-2 text-right font-semibold">CV spec</th>
              <th className="px-3 py-2 text-right font-semibold">Ash max</th>
              <th className="px-3 py-2 text-right font-semibold">TM max</th>
              <th className="px-3 py-2 text-right font-semibold">TS max</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-coal-100">
              <td className="px-3 py-2 font-mono">C-2024-001</td>
              <td className="px-3 py-2">Acme Coal International</td>
              <td className="px-3 py-2 text-right tabular-nums">6,300 GAR</td>
              <td className="px-3 py-2 text-right tabular-nums">6.0%</td>
              <td className="px-3 py-2 text-right tabular-nums">12%</td>
              <td className="px-3 py-2 text-right tabular-nums">0.50%</td>
            </tr>
            <tr className="border-t border-coal-100">
              <td className="px-3 py-2 font-mono">C-2024-002</td>
              <td className="px-3 py-2">Buana Energy</td>
              <td className="px-3 py-2 text-right tabular-nums">6,300 GAR</td>
              <td className="px-3 py-2 text-right tabular-nums">6.0%</td>
              <td className="px-3 py-2 text-right tabular-nums">12%</td>
              <td className="px-3 py-2 text-right tabular-nums">0.50%</td>
            </tr>
            <tr className="border-t border-coal-100">
              <td className="px-3 py-2 font-mono">C-2024-003</td>
              <td className="px-3 py-2">PLN (DMO)</td>
              <td className="px-3 py-2 text-right tabular-nums">6,300 GAR</td>
              <td className="px-3 py-2 text-right tabular-nums">6.0%</td>
              <td className="px-3 py-2 text-right tabular-nums">12%</td>
              <td className="px-3 py-2 text-right tabular-nums">0.50%</td>
            </tr>
          </tbody>
        </table>
      </section>
    </ModulePage>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" | "default" }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-coal-50/50";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${cls} p-2.5`}>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${valCls}`}>{value}</div>
    </div>
  );
}
