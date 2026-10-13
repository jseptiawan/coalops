"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { envRecords } from "@/lib/seed";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { Leaf, Droplet, Wind, FileText } from "lucide-react";

const limitByParam: Record<string, number> = {
  pH: 9,
  TSS: 50,
  Fe: 5,
  Mn: 2,
  OilGrease: 5,
  Debit: 100,
};

export default function Page() {
  const { t, lang } = useI18n();
  const tssSeries = envRecords
    .filter((r) => r.parameter === "TSS")
    .map((r) => ({ date: r.date.slice(5), value: r.value, point: r.point }));

  return (
    <ModulePage
      moduleKey="m13"
      moduleNumber={13}
      owner={lang === "id" ? "Kepala Dept. Lingkungan" : "Environment Dept Head"}
      description={
        lang === "id"
          ? "Manajemen air (kolam pengendapan, debit discharge, pH, TSS, Fe, Mn, Minyak & Lemak vs batas; curah hujan harian). Udara & kebisingan (TSP/PM10/PM2.5, kebisingan). Reklamasi progresif (Ha) per pit/dump. LB3 (limbah B3) dengan batas 90 hari. Kalender perizinan & kepatuhan. Insiden lingkungan & keluhan masyarakat."
          : "Water management (settling ponds, discharge debit, pH, TSS, Fe, Mn, Oil & Grease vs limits; daily rainfall). Air & noise (TSP/PM10/PM2.5, noise). Progressive reclamation (Ha) per pit/dump. LB3 (hazardous waste) with 90-day limit. Permits & compliance calendar. Environmental incidents & complaints."
      }
    >
      <div className="grid md:grid-cols-4 gap-2">
        <KPI label={lang === "id" ? "Pelanggaran aktif" : "Active exceedances"} value="1" tone="bad" />
        <KPI label="SP-02" value="71%" suffix={lang === "id" ? "ambang batas 75%" : "75% threshold"} tone="warning" />
        <KPI label={lang === "id" ? "Reklamasi YTD" : "Reclamation YTD"} value="32 Ha" suffix={lang === "id" ? "rencana 38 Ha" : "plan 38 Ha"} />
        <KPI label={lang === "id" ? "AMDAL" : "AMDAL"} value={lang === "id" ? "90 hari" : "90 days"} tone="warning" />
      </div>

      {/* Water quality chart */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <Droplet size={14} className="text-amber-600" />
          {lang === "id" ? "Kualitas Air Discharge (TSS mg/L)" : "Discharge Water Quality (TSS mg/L)"}
        </h3>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={tssSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <ReferenceLine y={50} stroke="#dc2626" strokeDasharray="3 3" label={{ value: "Batas 50 mg/L", position: "right", fontSize: 9, fill: "#dc2626" }} />
              <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: "#0ea5e9" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-red-600 mt-1">
          ⚠ {lang === "id" ? "Pelanggaran TSS di OP-01 kemarin (85 mg/L)." : "TSS exceedance at OP-01 yesterday (85 mg/L)."}
        </p>
      </section>

      {/* Settling ponds */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <Leaf size={14} className="text-amber-600" />
          {lang === "id" ? "Kolam Pengendapan" : "Settling Ponds"}
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { name: "SP-01", cap: "5,000 m³", sed: 45, threshold: 75 },
            { name: "SP-02", cap: "8,000 m³", sed: 71, threshold: 75 },
            { name: "SP-03", cap: "3,500 m³", sed: 38, threshold: 75 },
          ].map((p) => (
            <div key={p.name} className="rounded border border-coal-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.name}</div>
                <div className="text-[10px] text-coal-500">{p.cap}</div>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] text-coal-500">
                  <span>{lang === "id" ? "Sedimentasi" : "Sedimentation"}</span>
                  <span className={p.sed >= p.threshold ? "text-red-600 font-bold" : p.sed > p.threshold - 10 ? "text-amber-700" : "text-coal-700"}>
                    {p.sed}%
                  </span>
                </div>
                <div className="h-2 bg-coal-100 rounded mt-1">
                  <div
                    className={`h-2 rounded ${p.sed >= p.threshold ? "bg-red-500" : p.sed > p.threshold - 10 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${p.sed}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reclamation S-curve */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <Leaf size={14} className="text-amber-600" />
          {lang === "id" ? "Reklamasi Progresif (S-Curve)" : "Progressive Reclamation (S-Curve)"}
        </h3>
        <ReclamationChart />
      </section>

      {/* Permits */}
      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <FileText size={14} className="text-amber-600" />
            {lang === "id" ? "Perizinan & Kepatuhan" : "Permits & Compliance"}
          </h2>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Perizinan" : "Permit"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Nomor" : "Number"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Berlaku s/d" : "Expires"}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.status")}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "AMDAL/UKL-UPL", num: "AMDAL-2018-001", exp: "2027-01-15", status: "warning" },
                { name: "Water abstraction", num: "SIPA-2024-22", exp: "2029-05-20", status: "ok" },
                { name: "B3 storage permit", num: "TPS-LB3-2024", exp: "2027-09-10", status: "ok" },
                { name: "RKL-RPL reporting", num: "Q3-2026", exp: "2026-10-30", status: "warning" },
                { name: "Forestry borrow-use", num: "PBPH-2023", exp: "2028-08-12", status: "ok" },
              ].map((p, i) => (
                <tr key={i} className="border-t border-coal-100">
                  <td className="px-3 py-2 font-semibold">{p.name}</td>
                  <td className="px-3 py-2 font-mono">{p.num}</td>
                  <td className="px-3 py-2">{p.exp}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      p.status === "warning" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {p.status === "warning" ? (lang === "id" ? "SEGERA" : "EXPIRING SOON") : "OK"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ModulePage>
  );
}

function KPI({ label, value, suffix, tone }: { label: string; value: string; suffix?: string; tone?: "good" | "warning" | "bad" | "default" }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "warning" ? "border-amber-200 bg-amber-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-coal-50/50";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "warning" ? "text-amber-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${cls} p-2.5`}>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${valCls}`}>{value}</div>
      {suffix && <div className="text-[10px] text-coal-500 mt-0.5">{suffix}</div>}
    </div>
  );
}

function ReclamationChart() {
  const data = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const plan = 4 + month * 2.5;
    const actual = month <= 9 ? plan - (month > 6 ? 0.8 : 0) : null;
    return { month: `M${month}`, plan: Math.round(plan * 10) / 10, actual: actual ? Math.round(actual * 10) / 10 : null };
  });
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" fontSize={10} />
          <YAxis fontSize={10} unit=" Ha" />
          <Tooltip />
          <Line type="monotone" dataKey="plan" stroke="#0f172a" strokeWidth={2} dot={false} name="Plan" />
          <Line type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={2} dot={{ fill: "#16a34a" }} name="Actual" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
