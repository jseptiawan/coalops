"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { reconciliations } from "@/lib/seed";
import { fmtPct } from "@/lib/aggregations";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { Ruler, AlertTriangle } from "lucide-react";

const statusColors: Record<string, string> = {
  OK: "bg-emerald-100 text-emerald-700",
  UNDER_INVESTIGATION: "bg-amber-100 text-amber-700",
  ADJUSTED: "bg-blue-100 text-blue-700",
};

export default function Page() {
  const { t, lang } = useI18n();
  return (
    <ModulePage
      moduleKey="m12"
      moduleNumber={12}
      owner={lang === "id" ? "Kepala Dept. Rekayasa" : "Engineering Dept Head"}
      description={
        lang === "id"
          ? "Rekonsiliasi akhir bulan (opsional mingguan) volume material antara SURVEI vs TRUCK COUNT untuk SETIAP pit dan SETIAP area dumping. Survey: volume BCM/ton, metode UAV/GPS/RTK/total station. Truck count: trip, payload rata-rata. Varians = Truck Count − Survei. Toleransi default ±5% (dapat dikonfigurasi). Alur kerja: Draft → Diajukan → Direview → Disetujui GM → Ditutup. Setelah disetujui, volume Survey-Adjusted mengalir kembali ke produksi MTD/YTD/LTD (tampilan ganda: Dilaporkan vs Survey-Adjusted)."
          : "End-of-Month (optionally weekly) reconciliation of material movement between SURVEY volume vs TRUCK COUNT volume for EVERY pit and EVERY dumping/disposal area. Survey: volume BCM/tonnes, method UAV/GPS/RTK/total station. Truck count: trips, average payload. Variance = Truck Count − Survey. Tolerance default ±5% (configurable). Workflow: Draft → Submitted → Reviewed → GM Approved → Closed. On approval, Survey-Adjusted volumes flow back to production MTD/YTD/LTD (dual display: Reported vs Survey-Adjusted)."
      }
    >
      <div className="grid md:grid-cols-3 gap-2">
        <KPI label={lang === "id" ? "Rekonsiliasi bulan lalu" : "Last month recon"} value="Closed" tone="good" />
        <KPI label={lang === "id" ? "Di luar toleransi" : "Out of tolerance"} value="2" tone="bad" />
        <KPI label={lang === "id" ? "Bulan ini" : "This month"} value={lang === "id" ? "Draf" : "Draft"} />
      </div>

      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <Ruler size={14} className="text-amber-600" />
          {lang === "id" ? "Varians per Pit / Area (%)" : "Variance by Pit / Area (%)"}
        </h3>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={reconciliations.map((r) => ({ name: `${r.pit} ${r.material}`, variance: r.variancePct }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis fontSize={10} unit="%" />
              <Tooltip />
              <ReferenceLine y={5} stroke="#eab308" strokeDasharray="3 3" label={{ value: "+5%", position: "right", fontSize: 9 }} />
              <ReferenceLine y={-5} stroke="#eab308" strokeDasharray="3 3" />
              <Bar dataKey="variance" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200">
          <h2 className="text-sm font-bold">{lang === "id" ? "Rekonsiliasi (Periode)" : "Reconciliation Records"}</h2>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Periode" : "Period"}</th>
                <th className="px-3 py-2 text-left font-semibold">Pit</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Material" : "Material"}</th>
                <th className="px-3 py-2 text-right font-semibold">% {lang === "id" ? "Varians" : "Variance"}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.status")}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Akar masalah" : "Root cause"}</th>
              </tr>
            </thead>
            <tbody>
              {reconciliations.map((r, i) => (
                <tr key={i} className="border-t border-coal-100 hover:bg-coal-50">
                  <td className="px-3 py-2 font-mono">{r.period}</td>
                  <td className="px-3 py-2">{r.pit}</td>
                  <td className="px-3 py-2">{r.material}</td>
                  <td className={`px-3 py-2 text-right tabular-nums font-semibold ${
                    Math.abs(r.variancePct) > 5 ? "text-red-600" : "text-emerald-700"
                  }`}>
                    {fmtPct(r.variancePct, 1)}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusColors[r.status]}`}>
                      {r.status === "OK" ? "OK" : r.status === "UNDER_INVESTIGATION" ? (lang === "id" ? "DALAM INVESTIGASI" : "UNDER INVESTIGATION") : (lang === "id" ? "DISESUAIKAN" : "ADJUSTED")}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-coal-600">{r.rootCause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
        <h3 className="font-semibold text-amber-800 flex items-center gap-1.5">
          <AlertTriangle size={14} /> {lang === "id" ? "Catatan Tampilan Ganda" : "Dual Display Note"}
        </h3>
        <p className="text-amber-700 mt-1">
          {lang === "id"
            ? "Setelah disetujui GM, volume Survey-Adjusted menggantikan Reported untuk MTD/YTD/LTD. Saat ini: 2 kasus Sept ditutup dengan ADJUSTED; 2 kasus Oktober sedang dalam investigasi."
            : "After GM approval, Survey-Adjusted volumes replace Reported for MTD/YTD/LTD. Currently: 2 Sept cases closed with ADJUSTED; 2 October cases under investigation."}
        </p>
      </div>
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
