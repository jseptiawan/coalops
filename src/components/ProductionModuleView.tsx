"use client";
import { useI18n } from "@/lib/i18n";
import { usePeriod } from "@/lib/period";
import { aggregateStage, fmtNum, fmtPct } from "@/lib/aggregations";
import { productionActuals, equipment } from "@/lib/seed";
import { achColor, type ProductionStage } from "@/lib/types";
import { StandardRecapTable } from "@/components/StandardRecapTable";
import { Sparkline } from "@/components/Sparkline";
import { useMemo } from "react";
import { Plus, Filter, AlertTriangle, Truck, Wrench, Activity } from "lucide-react";

interface ProductionModuleViewProps {
  stage: ProductionStage;
  stageLabelKey: string;
  moduleNumber: number;
  moduleKey: string;
  owner: string;
  description: string;
  extraFields?: { key: string; label: string; value: string; tone?: "default" | "good" | "bad" }[];
}

export function ProductionModuleView(props: ProductionModuleViewProps) {
  const { t } = useI18n();
  const { period } = usePeriod();
  const today = new Date("2026-10-13T00:00:00+07:00");
  const agg = aggregateStage(props.stage, productionActuals, period, today);
  const yst = aggregateStage(props.stage, productionActuals, "yesterday", today);
  const todayAgg = aggregateStage(props.stage, productionActuals, "daily", today);

  const dailyRows = useMemo(() => {
    return productionActuals
      .filter((r) => r.stage === props.stage)
      .slice(0, 14);
  }, [props.stage]);

  const ach = achColor(agg.pct);
  const deployedUnits = equipment.slice(0, 6);

  return (
    <div className="space-y-3">
      {/* Data entry form */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <header className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Plus size={14} className="text-amber-600" />
            {props.moduleNumber === 7
              ? t("production.landClearing") + " · " + t("common.actual")
              : t("common.actual") + " · " + t(stageLabelKey[props.stage] || "")}
          </h2>
          <span className="text-[10px] text-coal-500 uppercase tracking-wider">
            {t("common.shift")} 1 + 2 · {t("common.date")} 2026-10-13
          </span>
        </header>
        <div className="grid md:grid-cols-6 gap-2">
          <Field label={t("common.location")} value="Pit A" />
          <Field label={t("common.shift")} value="1" />
          <Field label={t("common.plan")} value={fmtNum(agg.plan)} />
          <Field label={t("common.actual")} value={fmtNum(todayAgg.actual)} />
          <Field label={t("common.remarks")} value={t("common.remarks") + ": " + (todayAgg.actual < todayAgg.plan ? t("common.warning") : t("common.ok"))} />
          <Field
            label={t("common.cause")}
            value={todayAgg.actual < todayAgg.plan ? "Weather+Equipment" : "Normal"}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-coal-500 uppercase tracking-wider">{t("common.equipment")}:</span>
          {deployedUnits.map((u) => (
            <span
              key={u.id}
              className={`px-1.5 py-0.5 rounded border ${
                u.status === "Breakdown"
                  ? "border-red-300 bg-red-50 text-red-700"
                  : u.status === "Operating"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-coal-200 bg-coal-50 text-coal-600"
              }`}
            >
              {u.code} · {u.status}
            </span>
          ))}
        </div>
      </section>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <KPI
          label={t("common.actual")}
          value={fmtNum(agg.actual)}
          unit={agg.unit}
          icon={<Activity size={14} />}
        />
        <KPI
          label={t("common.plan")}
          value={fmtNum(agg.plan)}
          unit={agg.unit}
          icon={<Activity size={14} />}
        />
        <KPI
          label={t("common.achievement")}
          value={agg.plan > 0 ? fmtPct(agg.pct, 1) : "—"}
          tone={ach === "green" ? "good" : ach === "yellow" ? "default" : "bad"}
          icon={<Activity size={14} />}
        />
        <KPI
          label={t("common.vsYesterday")}
          value={
            yst.actual > 0
              ? fmtPct(((todayAgg.actual - yst.actual) / yst.actual) * 100, 1)
              : "—"
          }
          tone={todayAgg.actual >= yst.actual ? "good" : "bad"}
        />
      </div>

      {/* Trend chart */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <header className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold">{t("common.trend")} – 14 {lang("days")}</h2>
          <span className="text-[10px] text-coal-500 uppercase tracking-wider">
            {t("common.actual")} vs {t("common.plan")} ({fmtNum(agg.plan / 14)}/{agg.unit})
          </span>
        </header>
        <TrendChart data={agg.trend} planPerDay={agg.plan / 14} unit={agg.unit} />
      </section>

      {/* Daily table */}
      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200 flex items-center justify-between">
          <h2 className="text-sm font-bold">{t("common.daily")} – {t("common.actual")}</h2>
          <button className="text-[11px] flex items-center gap-1 px-2 py-1 rounded hover:bg-coal-100">
            <Filter size={12} /> {t("common.filter")}
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">{t("common.date")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.shift")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.location")}</th>
                <th className="px-3 py-2 text-right font-semibold">{t("common.plan")}</th>
                <th className="px-3 py-2 text-right font-semibold">{t("common.actual")}</th>
                <th className="px-3 py-2 text-right font-semibold">%</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.cause")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.remarks")}</th>
              </tr>
            </thead>
            <tbody>
              {dailyRows.map((r, i) => {
                const pct = r.planTonnes > 0 ? (r.actualTonnes / r.planTonnes) * 100 : 0;
                return (
                  <tr key={i} className="border-t border-coal-100 hover:bg-coal-50">
                    <td className="px-3 py-2">{r.date}</td>
                    <td className="px-3 py-2">{r.shift}</td>
                    <td className="px-3 py-2">{r.location}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtNum(r.planTonnes)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtNum(r.actualTonnes)}</td>
                    <td className={`px-3 py-2 text-right tabular-nums font-semibold ${
                      pct >= 95 ? "text-emerald-700" : pct >= 80 ? "text-amber-700" : "text-red-700"
                    }`}>{fmtPct(pct, 0)}</td>
                    <td className="px-3 py-2 text-coal-600">{r.cause || "—"}</td>
                    <td className="px-3 py-2 text-coal-600">{r.remarks || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Traceback / remarks */}
      <section className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
        <h3 className="font-semibold text-amber-800 flex items-center gap-1.5">
          <AlertTriangle size={14} /> {t("common.remarks")}
        </h3>
        <p className="text-amber-700 mt-1">
          {t("dashboard.traceBackDesc")} {props.stage === "obRemoval"
            ? lang("Three weak days from EX-102 hydraulic pump and DT-204 engine overheating; weather affected 2 days.")
            : props.stage === "coalHauling"
            ? lang("30% below plan on 2 days due to weather + DT-204 breakdown.")
            : lang("No significant bottleneck in this period.")}
        </p>
      </section>
    </div>
  );
}

const stageLabelKey: Record<string, string> = {
  loadToBarge: "production.loadToBarge",
  coalHauling: "production.coalHauling",
  crushing: "production.crushing",
  coalGetting: "production.coalGetting",
  obRemoval: "production.obRemoval",
  drillingBlasting: "production.drillingBlasting",
  landClearing: "production.landClearing",
};

function lang(s: string) {
  return s;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function KPI({ label, value, unit, tone, icon }: { label: string; value: string; unit?: string; tone?: "good" | "bad" | "default"; icon?: React.ReactNode }) {
  const toneCls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-white";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${toneCls} p-2.5`}>
      <div className="flex items-center gap-1 text-coal-500 text-[10px] uppercase tracking-wider">
        {icon} {label}
      </div>
      <div className={`text-xl font-bold mt-0.5 ${valCls}`}>
        {value}
        {unit && <span className="text-[10px] text-coal-500 font-normal ml-1">{unit}</span>}
      </div>
    </div>
  );
}

function TrendChart({ data, planPerDay, unit }: { data: number[]; planPerDay: number; unit: string }) {
  const max = Math.max(...data, planPerDay) * 1.2;
  return (
    <div>
      <svg viewBox="0 0 600 160" className="w-full h-32">
        <line
          x1="0"
          y1={160 - (planPerDay / max) * 140}
          x2="600"
          y2={160 - (planPerDay / max) * 140}
          stroke="#d1d5db"
          strokeDasharray="4 4"
        />
        <text x="6" y={160 - (planPerDay / max) * 140 - 4} fontSize="9" fill="#6b7280">
          Plan {Math.round(planPerDay)} {unit}
        </text>
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * 600;
          const y = 160 - (v / max) * 140;
          return <circle key={i} cx={x} cy={y} r="2.5" fill={v >= planPerDay ? "#16a34a" : v >= planPerDay * 0.85 ? "#eab308" : "#dc2626"} />;
        })}
        <polyline
          points={data.map((v, i) => {
            const x = (i / (data.length - 1)) * 600;
            const y = 160 - (v / max) * 140;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ")}
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
