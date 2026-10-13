"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { budgetLines } from "@/lib/seed";
import { fmtPct, fmtNum } from "@/lib/aggregations";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { Banknote, AlertTriangle, TrendingUp } from "lucide-react";

export default function Page() {
  const { t, lang } = useI18n();
  const totalMTD = budgetLines.reduce((a, b) => a + b.mtdPlan, 0);
  const totalMTDAct = budgetLines.reduce((a, b) => a + b.mtdActual, 0);
  const totalYTD = budgetLines.reduce((a, b) => a + b.ytdPlan, 0);
  const totalYTDAct = budgetLines.reduce((a, b) => a + b.ytdActual, 0);
  const totalAnnual = budgetLines.reduce((a, b) => a + b.ytdPlanTotal, 0);

  const chartData = budgetLines.map((b) => ({
    name: b.department.length > 12 ? b.department.slice(0, 12) : b.department,
    YTDPlan: b.ytdPlan / 1_000_000_000,
    YTDActual: b.ytdActual / 1_000_000_000,
  }));

  return (
    <ModulePage
      moduleKey="m16"
      moduleNumber={16}
      owner={lang === "id" ? "Kepala Dept. Keuangan & Akuntansi" : "Finance & Accounting Dept Head"}
      description={
        lang === "id"
          ? "Master anggaran per departemen → cost center → cost element (bulanan/tahunan, versi: Original/Revised/Forecast). Kontrak tarif satuan (auto-costing). Entry biaya aktual (harian/mingguan/bulanan) + impor CSV + API. Analisis varians: Anggaran vs Aktual vs Komitmen vs Forecast; MTD/YTD; remaining budget; burn rate; year-end projection; pita warna (hijau ≤100%, kuning 100-105%, merah >105%). KPI unit cost otomatis. Procurement ringan (PR → PO → GRN) dengan cek ketersediaan anggaran."
          : "Budget master per department → cost center → cost element (monthly/annual, versions: Original/Revised/Forecast). Unit rate contracts (auto-costing). Actual cost entry (daily/weekly/monthly) + CSV import + API. Variance analysis: Budget vs Actual vs Commitment vs Forecast; MTD/YTD; remaining budget; burn rate; year-end projection; color bands (green ≤100%, yellow 100-105%, red >105%). Auto-computed unit cost KPIs. Light procurement (PR → PO → GRN) with budget availability check."
      }
    >
      <div className="grid md:grid-cols-4 gap-2">
        <KPI label="MTD {lang === 'id' ? 'Anggaran' : 'Budget'}" value={`Rp ${(totalMTD / 1_000_000_000).toFixed(2)}B`} />
        <KPI label="MTD {lang === 'id' ? 'Aktual' : 'Actual'}" value={`Rp ${(totalMTDAct / 1_000_000_000).toFixed(2)}B`} />
        <KPI label="YTD {lang === 'id' ? 'Penyerapan' : 'Burn'}" value={fmtPct((totalYTDAct / totalYTD) * 100, 0)} tone={(totalYTDAct / totalYTD) > 1 ? "bad" : "good"} />
        <KPI label={lang === "id" ? "Sisa anggaran" : "Remaining budget"} value={`Rp ${((totalAnnual - totalYTDAct) / 1_000_000_000).toFixed(1)}B`} />
      </div>

      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <TrendingUp size={14} className="text-amber-600" />
          YTD {lang === "id" ? "Anggaran vs Aktual per Departemen (IDR Bn)" : "Budget vs Actual per Department (IDR Bn)"}
        </h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={10} angle={-25} textAnchor="end" height={50} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="YTDPlan" fill="#94a3b8" name={lang === "id" ? "Rencana" : "Plan"} />
              <Bar dataKey="YTDActual" fill="#f59e0b" name={lang === "id" ? "Aktual" : "Actual"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Banknote size={14} className="text-amber-600" />
            {lang === "id" ? "Varians Anggaran" : "Budget Variance"}
          </h2>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Departemen" : "Department"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Elemen" : "Element"}</th>
                <th className="px-3 py-2 text-right font-semibold">MTD {lang === "id" ? "Rencana" : "Plan"}</th>
                <th className="px-3 py-2 text-right font-semibold">MTD {lang === "id" ? "Aktual" : "Actual"}</th>
                <th className="px-3 py-2 text-right font-semibold">YTD {lang === "id" ? "Rencana" : "Plan"}</th>
                <th className="px-3 py-2 text-right font-semibold">YTD {lang === "id" ? "Aktual" : "Actual"}</th>
                <th className="px-3 py-2 text-right font-semibold">YTD %</th>
                <th className="px-3 py-2 text-center font-semibold">{lang === "id" ? "Pita" : "Band"}</th>
              </tr>
            </thead>
            <tbody>
              {budgetLines.map((b, i) => {
                const pct = (b.ytdActual / b.ytdPlan) * 100;
                const band = pct <= 100 ? "green" : pct <= 105 ? "yellow" : "red";
                return (
                  <tr key={i} className="border-t border-coal-100">
                    <td className="px-3 py-2 font-semibold">{b.department}</td>
                    <td className="px-3 py-2">{b.costElement}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{(b.mtdPlan / 1_000_000_000).toFixed(2)}B</td>
                    <td className="px-3 py-2 text-right tabular-nums">{(b.mtdActual / 1_000_000_000).toFixed(2)}B</td>
                    <td className="px-3 py-2 text-right tabular-nums">{(b.ytdPlan / 1_000_000_000).toFixed(1)}B</td>
                    <td className="px-3 py-2 text-right tabular-nums">{(b.ytdActual / 1_000_000_000).toFixed(1)}B</td>
                    <td className={`px-3 py-2 text-right tabular-nums font-bold ${
                      band === "green" ? "text-emerald-700" : band === "yellow" ? "text-amber-700" : "text-red-700"
                    }`}>{fmtPct(pct, 0)}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        band === "green" ? "bg-emerald-100 text-emerald-700" : band === "yellow" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      }`}>
                        {band === "green" ? "OK" : band === "yellow" ? (lang === "id" ? "WASPADA" : "WARN") : (lang === "id" ? "OVER" : "OVER")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs flex items-start gap-2">
        <AlertTriangle size={14} className="text-amber-600 mt-0.5" />
        <div>
          <div className="font-semibold text-amber-800">
            {lang === "id" ? "Departemen Plant & Maintenance YTD 108% – perhatian manajemen" : "Plant & Maintenance YTD 108% – management attention"}
          </div>
          <p className="text-amber-700 mt-0.5">
            {lang === "id"
              ? "Suku cadang & workshop kontraktor melebihi rencana karena kerusakan tidak terduga. Anggaran akan ditransfer dari kontingensi."
              : "Spare parts & workshop contractor exceeded plan due to unplanned repairs. Budget will be transferred from contingency."}
          </p>
        </div>
      </div>
    </ModulePage>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone?: "good" | "warning" | "bad" | "default" }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "warning" ? "border-amber-200 bg-amber-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-coal-50/50";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "warning" ? "text-amber-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${cls} p-2.5`}>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${valCls}`}>{value}</div>
    </div>
  );
}
