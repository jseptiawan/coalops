"use client";
import { ModulePage } from "@/components/ModulePage";
import { ProductionModuleView } from "@/components/ProductionModuleView";
import { useI18n } from "@/lib/i18n";
import { shipments, executiveSummary } from "@/lib/seed";
import { fmtNum, fmtPct } from "@/lib/aggregations";
import { Briefcase, Clock, TrendingUp, AlertCircle } from "lucide-react";

export default function Page() {
  const { t, lang } = useI18n();
  return (
    <ModulePage
      moduleKey="m1"
      moduleNumber={1}
      owner={lang === "id" ? "Kepala Dept. Pelabuhan & Barging" : "Port & Barging Dept Head"}
      description={
        lang === "id"
          ? "Pemuatan batubara ke tongkang. Input per tanggal/shift: nama/ID tongkang, kapasitas, tonase, laju muat (TPH), waktu sandar, durasi muat. Setiap tongkang terkait dengan kualitas bersertifikat (M14), catatan pengiriman/penjualan (M15), dan neraca batubara (M17)."
          : "Loading coal to barges. Inputs per date/shift: barge name/ID, capacity, tonnage, loading rate (TPH), arrival/departure, loading duration. Each barge links to certified quality (M14), shipment/sales record (M15), and the coal account (M17)."
      }
    >
      <ProductionModuleView
        stage="loadToBarge"
        stageLabelKey="production.loadToBarge"
        moduleNumber={1}
        moduleKey="m1"
        owner=""
        description=""
        extraFields={[
          { key: "barges", label: t("production.bargesCompleted"), value: "12" },
          { key: "rate", label: t("production.loadingRate"), value: "1,250 TPH" },
          { key: "turnaround", label: t("production.turnaroundTime"), value: "9.4 h" },
        ]}
      />

      {/* Barge records & laycan/demurrage exposure */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <header className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Briefcase size={14} className="text-amber-600" />
            {t("dashboard.laycan")}
          </h2>
          <span className="text-[10px] text-coal-500 uppercase tracking-wider">
            {lang === "id" ? "Sumber: M15" : "Source: M15"}
          </span>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <KPI label={lang === "id" ? "Tongkang aktif" : "Active barges"} value="3" />
          <KPI label={lang === "id" ? "Rata-rata tunggu" : "Avg waiting"} value="14.2 h" tone="bad" />
          <KPI label={lang === "id" ? "Risiko demurrage" : "Demurrage risk"} value="2 / 3" tone="bad" />
          <KPI label={lang === "id" ? "Eksposur estimasi" : "Est. exposure"} value="USD 28K" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">Barge</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.date")}</th>
                <th className="px-3 py-2 text-left font-semibold">Contract</th>
                <th className="px-3 py-2 text-right font-semibold">{t("common.tonnes")}</th>
                <th className="px-3 py-2 text-right font-semibold">CV (kcal/kg)</th>
                <th className="px-3 py-2 text-right font-semibold">{lang === "id" ? "Harga" : "Price"} (USD)</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.status")}</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => (
                <tr key={s.id} className="border-t border-coal-100 hover:bg-coal-50">
                  <td className="px-3 py-2 font-mono">{s.barge}</td>
                  <td className="px-3 py-2">{s.date}</td>
                  <td className="px-3 py-2">{s.contract}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtNum(s.tonnes)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    <span className={s.cvGAR < s.specCV ? "text-red-600 font-semibold" : "text-emerald-700"}>
                      {s.cvGAR} {s.cvGAR < s.specCV ? "❗" : ""}
                    </span>
                    <span className="text-coal-400 text-[10px] ml-1">/ {s.specCV}</span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">${s.priceRealized}</td>
                  <td className="px-3 py-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-coal-100 text-coal-700">
                      {s.invoiceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Connection to M15 + M17 */}
      <section className="bg-coal-50 border border-coal-200 rounded-lg p-3 text-[11px] text-coal-600">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-coal-700">
            {lang === "id" ? "Tautan modul:" : "Module links:"}
          </span>
          <a href="/module/14" className="px-2 py-0.5 rounded bg-white border border-coal-200 hover:bg-amber-50">
            M14 · {lang === "id" ? "Kualitas bersertifikat" : "Certified quality"}
          </a>
          <a href="/module/15" className="px-2 py-0.5 rounded bg-white border border-coal-200 hover:bg-amber-50">
            M15 · {lang === "id" ? "Pengiriman/Penjualan" : "Shipment/Sales"}
          </a>
          <a href="/module/17" className="px-2 py-0.5 rounded bg-white border border-coal-200 hover:bg-amber-50">
            M17 · {lang === "id" ? "Neraca batubara" : "Coal account"}
          </a>
        </div>
      </section>
    </ModulePage>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-coal-50/50";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${cls} p-2.5`}>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${valCls}`}>{value}</div>
    </div>
  );
}
