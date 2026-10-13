"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { workOrders } from "@/lib/seed";
import { Wrench, Package, Calendar } from "lucide-react";

const statusColors: Record<string, string> = {
  Requested: "bg-coal-100 text-coal-700",
  Approved: "bg-blue-100 text-blue-700",
  Scheduled: "bg-amber-100 text-amber-700",
  InProgress: "bg-orange-100 text-orange-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Verified: "bg-emerald-200 text-emerald-800",
  Closed: "bg-coal-200 text-coal-800",
};

const priorityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-800 border-red-300",
  High: "bg-orange-100 text-orange-800 border-orange-300",
  Medium: "bg-amber-100 text-amber-800 border-amber-300",
  Low: "bg-coal-100 text-coal-700 border-coal-300",
};

export default function Page() {
  const { t, lang } = useI18n();
  const open = workOrders.filter((w) => !["Closed", "Verified", "Completed"].includes(w.status));
  const totalCost = workOrders.reduce((a, w) => a + w.costIDR, 0);

  return (
    <ModulePage
      moduleKey="m10"
      moduleNumber={10}
      owner={lang === "id" ? "Kepala Dept. Pabrik & Pemeliharaan" : "Plant & Maintenance Dept Head"}
      description={
        lang === "id"
          ? "Work Order otomatis bernomor, tipe (Breakdown, PM 250H/500H/1000H/2000H, Predictive, Condition Monitoring, Modification/Project), unit, deskripsi kegagalan, kategori penyebab, prioritas, tim teknisi, alur status, biaya parts & tenaga kerja (umpan M16). Kalender jadwal PM. Suku cadang. Backlog register dengan aging buckets."
          : "Auto-numbered Work Orders, type (Breakdown, PM 250H/500H/1000H/2000H, Predictive, Condition Monitoring, Modification/Project), unit, failure description, cause category, priority, technician/team, status flow, parts & labor cost (feeds M16). PM Schedule Calendar. Spare parts. Backlog register with aging buckets."
      }
    >
      <div className="grid md:grid-cols-4 gap-2">
        <KPI label={lang === "id" ? "WO Terbuka" : "Open WOs"} value={open.length.toString()} />
        <KPI label={lang === "id" ? "PM Compliance" : "PM Compliance"} value="92%" tone="good" />
        <KPI label={lang === "id" ? "MTTR" : "MTTR"} value="6.8 h" />
        <KPI label={lang === "id" ? "Total biaya" : "Total cost"} value={`Rp ${(totalCost / 1_000_000_000).toFixed(2)}B`} />
      </div>

      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200 flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Wrench size={14} className="text-amber-600" />
            {lang === "id" ? "Work Order" : "Work Orders"}
          </h2>
          <div className="flex items-center gap-1 text-[11px]">
            <button className="px-2 py-1 rounded bg-amber-500 text-coal-950 font-semibold">+ {lang === "id" ? "WO Baru" : "New WO"}</button>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">WO #</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Unit" : "Unit"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Tipe" : "Type"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Deskripsi" : "Description"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Prioritas" : "Priority"}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.status")}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Buka" : "Open"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Batas" : "Due"}</th>
                <th className="px-3 py-2 text-right font-semibold">{lang === "id" ? "Jam" : "Hours"}</th>
                <th className="px-3 py-2 text-right font-semibold">Biaya (IDR)</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((w) => (
                <tr key={w.id} className="border-t border-coal-100 hover:bg-coal-50">
                  <td className="px-3 py-2 font-mono">{w.id}</td>
                  <td className="px-3 py-2 font-mono">{w.unit}</td>
                  <td className="px-3 py-2">{w.type}</td>
                  <td className="px-3 py-2">{w.description}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${priorityColors[w.priority]}`}>{w.priority}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusColors[w.status]}`}>{w.status}</span>
                  </td>
                  <td className="px-3 py-2">{w.openDate}</td>
                  <td className="px-3 py-2">{w.dueDate}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{w.downtimeHours}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{(w.costIDR / 1_000_000).toFixed(0)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-3">
        {/* Spare parts */}
        <section className="bg-white rounded-lg border border-coal-200 p-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
            <Package size={14} className="text-amber-600" />
            {lang === "id" ? "Suku Cadang Kritis" : "Critical Spare Parts"}
          </h3>
          <ul className="text-xs divide-y divide-coal-100">
            {[
              { part: "Hydraulic pump EX1900", stock: 1, min: 2, critical: true },
              { part: "Engine coolant 20L", stock: 12, min: 6, critical: false },
              { part: "Track shoe D8T", stock: 4, min: 4, critical: false },
              { part: "Air filter 777G", stock: 18, min: 10, critical: false },
              { part: "Barge hatch seal", stock: 2, min: 4, critical: true },
            ].map((s, i) => (
              <li key={i} className="py-1.5 flex items-center justify-between">
                <span>{s.part}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  s.critical ? "bg-red-100 text-red-700" : s.stock < s.min ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {s.stock} / {s.min}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Backlog aging */}
        <section className="bg-white rounded-lg border border-coal-200 p-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
            <Calendar size={14} className="text-amber-600" />
            {lang === "id" ? "Backlog (Aging)" : "Backlog (Aging)"}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <Bucket label="0-7 days" hours={42} total={178} />
            <Bucket label="8-14 days" hours={68} total={178} />
            <Bucket label=">14 days" hours={68} total={178} />
          </div>
          <p className="text-[11px] text-coal-500 mt-2">
            {lang === "id" ? "Target backlog ≤ 120 jam" : "Target backlog ≤ 120 hours"}
          </p>
        </section>
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

function Bucket({ label, hours, total }: { label: string; hours: number; total: number }) {
  const pct = (hours / total) * 100;
  return (
    <div>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className="text-xl font-bold">{hours}h</div>
      <div className="h-1.5 bg-coal-100 rounded mt-1">
        <div className="h-1.5 bg-amber-500 rounded" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
