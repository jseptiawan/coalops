"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { dashboardKPIs, equipment, workOrders } from "@/lib/seed";
import { fmtNum, fmtPct } from "@/lib/aggregations";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from "recharts";
import { AlertTriangle, Activity } from "lucide-react";

export default function Page() {
  const { t, lang } = useI18n();
  const k = dashboardKPIs;

  // Bad actors (top units with low utilization)
  const bad = [...equipment].sort((a, b) => a.utilizationPct - b.utilizationPct).slice(0, 5);

  // MA trend (synthetic)
  const trend = Array.from({ length: 14 }, (_, i) => ({
    day: `D-${14 - i}`,
    MA: 78 + Math.sin(i * 0.5) * 5 + (i > 10 ? -8 : 0),
    PA: 84 + Math.sin(i * 0.4) * 3,
    Target: 85,
  }));

  return (
    <ModulePage
      moduleKey="m9"
      moduleNumber={9}
      owner={lang === "id" ? "Kepala Dept. Pabrik & Pemeliharaan (entry oleh Maintenance Planner)" : "Plant & Maintenance Dept Head (entry by Maintenance Planner)"}
      description={
        lang === "id"
          ? "Pencatatan downtime harian per unit per shift; kategori harus berjumlah 24 jam: Operasi, Perbaikan Breakdown, Pemeliharaan Terencana, Menunggu Suku Cadang, Menunggu SDM/Operator, Standby. KPI otomatis: MA, PA, EA, MTBF, MTTR, Pareto penyebab downtime, top 10 bad actor unit, jam backlog."
          : "Daily downtime logging per unit per shift; categories must total 24h: Operating, Breakdown Repair, Planned Maintenance, Waiting for Parts, Waiting for Manpower/Operator, Standby. Auto-calculated KPIs: MA, PA, EA, MTBF, MTTR, Pareto of downtime causes, top 10 bad actor units, backlog hours."
      }
    >
      <div className="grid md:grid-cols-4 gap-2">
        <KPI label="MA" value={fmtPct(k.siteMA)} target={`≥ ${k.targets.ma}%`} tone={k.siteMA >= k.targets.ma ? "good" : "bad"} />
        <KPI label="PA" value={fmtPct(k.sitePA)} target={`≥ ${k.targets.pa}%`} tone={k.sitePA >= k.targets.pa ? "good" : "bad"} />
        <KPI label="EU" value={fmtPct(k.siteEU)} target={`≥ ${k.targets.eu}%`} />
        <KPI label="MTBF" value="14.2 h" />
        <KPI label="MTTR" value="6.8 h" />
        <KPI label={lang === "id" ? "Backlog" : "Backlog"} value={`${fmtNum(k.backlogHours)} h`} target={`≤ 120 h`} tone={k.backlogHours > 120 ? "bad" : "good"} />
        <KPI label={lang === "id" ? "Pareto #1" : "Top Pareto"} value="Hydraulics" />
        <KPI label={lang === "id" ? "WO terbuka" : "Open WOs"} value={k.openWOs.toString()} />
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        {/* MA/PA trend */}
        <section className="bg-white rounded-lg border border-coal-200 p-4">
          <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5">
            <Activity size={14} className="text-amber-600" />
            {lang === "id" ? "Tren MA / PA" : "MA / PA Trend"} (14 {lang === "id" ? "hari" : "days"})
          </h3>
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" fontSize={10} />
                <YAxis fontSize={10} domain={[60, 100]} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="MA" fill="#f59e0b" />
                <Bar dataKey="PA" fill="#3b82f6" />
                <Bar dataKey="Target" fill="#16a34a" fillOpacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Bad actors */}
        <section className="bg-white rounded-lg border border-coal-200 p-4">
          <h3 className="text-sm font-bold mb-2 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-red-600" />
            {lang === "id" ? "Top 5 Bad Actor" : "Top 5 Bad Actor Units"}
          </h3>
          <ul className="space-y-1.5">
            {bad.map((u, i) => (
              <li key={u.id} className="flex items-center gap-2 text-xs">
                <span className="w-6 h-6 rounded-full bg-coal-100 flex items-center justify-center text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="font-mono font-semibold">{u.code}</span>
                <span className="text-coal-500">{u.make} {u.model}</span>
                <span className="ml-auto font-semibold text-red-600">{u.utilizationPct}%</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-coal-100">{u.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Critical WOs */}
      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200">
          <h2 className="text-sm font-bold">{lang === "id" ? "WO Kritis (Sumber: M10)" : "Critical WOs (Source: M10)"}</h2>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">WO</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Unit" : "Unit"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Tipe" : "Type"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Deskripsi" : "Description"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Prioritas" : "Priority"}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.status")}</th>
                <th className="px-3 py-2 text-right font-semibold">{lang === "id" ? "Downtime" : "Downtime"} (h)</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.filter(w => w.priority === "Critical" || w.priority === "High").map((w) => (
                <tr key={w.id} className="border-t border-coal-100">
                  <td className="px-3 py-2 font-mono">{w.id}</td>
                  <td className="px-3 py-2">{w.unit}</td>
                  <td className="px-3 py-2">{w.type}</td>
                  <td className="px-3 py-2">{w.description}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      w.priority === "Critical" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                    }`}>{w.priority}</span>
                  </td>
                  <td className="px-3 py-2">{w.status}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{w.downtimeHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ModulePage>
  );
}

function KPI({ label, value, target, tone }: { label: string; value: string; target?: string; tone?: "good" | "bad" | "default" }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-coal-50/50";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${cls} p-2.5`}>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${valCls}`}>{value}</div>
      {target && <div className="text-[10px] text-coal-500 mt-0.5">{target}</div>}
    </div>
  );
}
