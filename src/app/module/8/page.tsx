"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { equipment, dashboardKPIs } from "@/lib/seed";
import { fmtPct } from "@/lib/aggregations";
import { Truck, Wrench, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  Operating: "#16a34a",
  Standby: "#eab308",
  Breakdown: "#dc2626",
  UnderPM: "#3b82f6",
  Available: "#9ca3af",
};

export default function Page() {
  const { t, lang } = useI18n();
  const counts = equipment.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
  const k = dashboardKPIs;

  return (
    <ModulePage
      moduleKey="m8"
      moduleNumber={8}
      owner={lang === "id" ? "Kepala Dept. Pabrik/Rekayasa" : "Plant/Engineering Dept Head"}
      description={
        lang === "id"
          ? "Registry master alat: kode unit, kelas, make/model, nomor seri, kapasitas nominal, kepemilikan (sendiri/sewa/kontraktor), penugasan pit/site, status. Papan status armada harian, KPI utilisasi, manajemen BBM, tampilan dispatch, grafik."
          : "Equipment master registry: unit code, class, make/model, serial, nominal capacity, ownership (owned/rented/contractor), site/pit assignment, status. Daily fleet status board, utilization KPIs, fuel management, dispatch view, charts."
      }
    >
      <div className="grid lg:grid-cols-3 gap-3">
        {/* Status donut */}
        <div className="bg-white rounded-lg border border-coal-200 p-4">
          <h3 className="text-sm font-bold mb-2">{lang === "id" ? "Status Armada" : "Fleet Status"}</h3>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                  {data.map((d) => <Cell key={d.name} fill={COLORS[d.name] || "#6b7280"} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="text-[11px] grid grid-cols-2 gap-1">
            {data.map((d) => (
              <li key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded" style={{ background: COLORS[d.name] }} />
                {d.name}: <strong>{d.value}</strong>
              </li>
            ))}
          </ul>
        </div>

        {/* KPIs */}
        <div className="bg-white rounded-lg border border-coal-200 p-4 lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          <KPI label="MA" value={fmtPct(k.siteMA)} target={`≥ ${k.targets.ma}%`} tone={k.siteMA >= k.targets.ma ? "good" : "bad"} />
          <KPI label="PA" value={fmtPct(k.sitePA)} target={`≥ ${k.targets.pa}%`} tone={k.sitePA >= k.targets.pa ? "good" : "bad"} />
          <KPI label="EU" value={fmtPct(k.siteEU)} target={`≥ ${k.targets.eu}%`} tone={k.siteEU >= k.targets.eu ? "good" : "default"} />
          <KPI label={lang === "id" ? "Siap" : "Ready"} value={`${k.fleetReady} / ${k.totalEquipment}`} />
        </div>
      </div>

      {/* Equipment table */}
      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200 flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Truck size={14} className="text-amber-600" />
            {lang === "id" ? "Registry Master Alat" : "Equipment Master Registry"}
          </h2>
          <span className="text-[10px] text-coal-500 uppercase tracking-wider">
            {equipment.length} {lang === "id" ? "unit" : "units"}
          </span>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">Code</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Kelas" : "Class"}</th>
                <th className="px-3 py-2 text-left font-semibold">Make/Model</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Kapasitas" : "Capacity"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Situs" : "Site"}</th>
                <th className="px-3 py-2 text-right font-semibold">HM Total</th>
                <th className="px-3 py-2 text-right font-semibold">U %</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.status")}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Operator / SIMPER" : "Operator / SIMPER"}</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((e) => (
                <tr key={e.id} className="border-t border-coal-100 hover:bg-coal-50">
                  <td className="px-3 py-2 font-mono">{e.code}</td>
                  <td className="px-3 py-2">{e.class}</td>
                  <td className="px-3 py-2">{e.make} {e.model}</td>
                  <td className="px-3 py-2">{e.capacity}</td>
                  <td className="px-3 py-2">{e.site}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{e.hmTotal.toLocaleString()}</td>
                  <td className={`px-3 py-2 text-right tabular-nums font-semibold ${
                    e.utilizationPct >= 85 ? "text-emerald-700" : e.utilizationPct >= 70 ? "text-amber-700" : "text-red-700"
                  }`}>{e.utilizationPct}%</td>
                  <td className="px-3 py-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: COLORS[e.status] + "22", color: COLORS[e.status] }}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {e.assignedOperator ? (
                      <div>
                        <div>{e.assignedOperator}</div>
                        {e.operatorSIMPERExpiry && (
                          <div className={`text-[10px] ${
                            e.operatorSIMPERExpiry && new Date(e.operatorSIMPERExpiry) <= new Date()
                              ? "text-red-600 font-semibold"
                              : "text-coal-500"
                          }`}>
                            SIMPER: {e.operatorSIMPERExpiry}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-coal-400">—</span>
                    )}
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

function KPI({ label, value, target, tone }: { label: string; value: string; target?: string; tone?: "good" | "bad" | "default" }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-coal-50/50";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${cls} p-3`}>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold mt-0.5 ${valCls}`}>{value}</div>
      {target && <div className="text-[10px] text-coal-500 mt-0.5">{target}</div>}
    </div>
  );
}
