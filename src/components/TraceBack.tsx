"use client";
import { useI18n } from "@/lib/i18n";
import { usePeriod } from "@/lib/period";
import { productionActuals, equipment, workOrders, employees, envRecords, reconciliations, shipments, executiveSummary } from "@/lib/seed";
import { aggregateStage, fmtNum, fmtPct } from "@/lib/aggregations";
import { AlertTriangle, Wrench, Users, Beaker } from "lucide-react";
import Link from "next/link";

export function TraceBack() {
  const { t, lang } = useI18n();
  const { period } = usePeriod();
  const today = new Date("2026-10-13T00:00:00+07:00");
  const mtd = aggregateStage("obRemoval", productionActuals, "mtd", today);
  const isUnder = mtd.pct < 80;

  // ── Process branch
  const obMtd = aggregateStage("obRemoval", productionActuals, "mtd", today);
  const haulingMtd = aggregateStage("coalHauling", productionActuals, "mtd", today);
  const loadMtd = aggregateStage("loadToBarge", productionActuals, "mtd", today);
  const drillMtd = aggregateStage("drillingBlasting", productionActuals, "mtd", today);
  const landMtd = aggregateStage("landClearing", productionActuals, "mtd", today);

  // ── Equipment branch
  const brokenUnits = equipment.filter((e) => e.status === "Breakdown" || e.status === "UnderPM");
  const criticalWOs = workOrders.filter((w) => w.priority === "Critical" || w.priority === "High");

  // ── Manpower branch
  const expiredSimper = employees.filter((e) => {
    if (!e.simperExpiry) return false;
    return new Date(e.simperExpiry) <= today;
  });
  const expiringCert = employees.filter((e) => {
    if (!e.certExpiry) return false;
    const days = (new Date(e.certExpiry).getTime() - today.getTime()) / 86400000;
    return days <= 30 && days > 0;
  });

  // ── Quality branch
  const offSpec = shipments.filter((s) => s.cvGAR < s.specCV);
  const outOfTolRecon = reconciliations.filter((r) => Math.abs(r.variancePct) > 5);

  return (
    <div className="bg-white rounded-lg border border-coal-200 p-4">
      <header className="mb-3">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-600" />
          {t("dashboard.traceBack")}
        </h2>
        <p className="text-[11px] text-coal-500 mt-0.5">{t("dashboard.traceBackDesc")}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-3">
        <Branch
          icon={<AlertTriangle size={14} />}
          title={t("dashboard.branchProcess")}
          tone="amber"
          lines={[
            { label: t("production.loadToBarge"), value: fmtPct(loadMtd.pct, 0), actual: fmtNum(loadMtd.actual), href: "/module/1" },
            { label: t("production.coalHauling"), value: fmtPct(haulingMtd.pct, 0), actual: fmtNum(haulingMtd.actual), href: "/module/2" },
            { label: t("production.coalGetting"), value: fmtPct(aggregateStage("coalGetting", productionActuals, "mtd", today).pct, 0), href: "/module/4" },
            { label: t("production.obRemoval"), value: fmtPct(obMtd.pct, 0), actual: fmtNum(obMtd.actual) + " BCM", href: "/module/5" },
            { label: t("production.drillingBlasting"), value: fmtPct(drillMtd.pct, 0), href: "/module/6" },
            { label: t("production.landClearing"), value: fmtPct(landMtd.pct, 0), href: "/module/7" },
          ]}
          bottleneck={
            isUnder
              ? `${t("production.obRemoval")} ${fmtPct(obMtd.pct, 0)} (${lang === "id" ? "kurang dari rencana" : "below plan"})`
              : t("dashboard.bottleneckNone")
          }
        />
        <Branch
          icon={<Wrench size={14} />}
          title={t("dashboard.branchEquipment")}
          tone="red"
          lines={brokenUnits.map((u) => ({
            label: `${u.code} · ${u.make} ${u.model}`,
            value: u.status,
            href: "/module/8",
          }))}
          extra={
            criticalWOs.length > 0 ? (
              <div className="mt-2 pt-2 border-t border-coal-100 text-[11px]">
                <div className="font-semibold text-coal-700 mb-1">{lang === "id" ? "WO prioritas" : "Priority WOs"}</div>
                {criticalWOs.slice(0, 3).map((w) => (
                  <div key={w.id} className="text-coal-600">
                    {w.id} – {w.unit}: {w.description}
                  </div>
                ))}
              </div>
            ) : null
          }
          bottleneck={
            brokenUnits.length > 0
              ? `${brokenUnits[0].code} ${lang === "id" ? "dalam perbaikan" : "under repair"}`
              : t("dashboard.bottleneckNone")
          }
        />
        <Branch
          icon={<Users size={14} />}
          title={t("dashboard.branchManpower")}
          tone="yellow"
          lines={[
            { label: lang === "id" ? "Operator SIMPER kedaluwarsa" : "Expired SIMPER", value: expiredSimper.length.toString() },
            { label: lang === "id" ? "Sertifikat K3/POP ≤30 hari" : "K3/POP expiring ≤30d", value: expiringCert.length.toString() },
            { label: lang === "id" ? "Absensi hari ini" : "Today's absenteeism", value: "4.2%" },
          ]}
          bottleneck={
            expiredSimper.length > 0
              ? `${lang === "id" ? "Operator" : "Operator"} ${expiredSimper[0].name} – SIMPER ${lang === "id" ? "kedaluwarsa" : "expired"}`
              : t("dashboard.bottleneckNone")
          }
        />
        <Branch
          icon={<Beaker size={14} />}
          title={t("dashboard.branchQuality")}
          tone="red"
          lines={[
            { label: lang === "id" ? "Tongkang di luar spec" : "Off-spec barges", value: offSpec.length.toString() },
            { label: lang === "id" ? "Rekonsiliasi >5%" : "Reconciliation >5%", value: outOfTolRecon.length.toString() },
            ...offSpec.slice(0, 2).map((s) => ({
              label: `${s.barge} · ${s.contract}`,
              value: `CV ${s.cvGAR}/${s.specCV}`,
            })),
          ]}
          bottleneck={
            offSpec.length > 0
              ? `${offSpec[0].barge} – ${lang === "id" ? "CV di bawah spec" : "CV below spec"}`
              : outOfTolRecon.length > 0
              ? `${outOfTolRecon[0].pit} – ${lang === "id" ? "variansi tinggi" : "variance high"}`
              : t("dashboard.bottleneckNone")
          }
        />
      </div>

      <div className="mt-3 pt-3 border-t border-coal-100 text-[11px] text-coal-500">
        <strong className="text-coal-700">{t("dashboard.bottleneck")}:</strong>{" "}
        {executiveSummary.sections.bottleneck}
      </div>
    </div>
  );
}

function Branch({
  icon,
  title,
  tone,
  lines,
  bottleneck,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "red" | "amber" | "yellow";
  lines: { label: string; value: string; href?: string; actual?: string }[];
  bottleneck: string;
  extra?: React.ReactNode;
}) {
  const toneCls = tone === "red" ? "border-red-200 bg-red-50/30" : tone === "amber" ? "border-amber-200 bg-amber-50/30" : "border-yellow-200 bg-yellow-50/30";
  return (
    <div className={`rounded border ${toneCls} p-3`}>
      <div className="flex items-center gap-1.5 font-semibold text-xs text-coal-700 mb-2">
        {icon}
        {title}
      </div>
      <ul className="text-xs space-y-1">
        {lines.map((l, i) => {
          const inner = (
            <span className="flex items-center justify-between gap-2">
              <span className="text-coal-700 truncate">{l.label}</span>
              <span className="text-coal-900 font-semibold flex-shrink-0">
                {l.value}
                {l.actual && <span className="text-coal-500 font-normal ml-1">({l.actual})</span>}
              </span>
            </span>
          );
          return (
            <li key={i} className="border-b border-coal-100 pb-1 last:border-b-0">
              {l.href ? <Link href={l.href} className="hover:underline">{inner}</Link> : inner}
            </li>
          );
        })}
      </ul>
      {extra}
      <div className="mt-2 pt-2 border-t border-coal-200/60 text-[11px]">
        <span className="font-semibold text-coal-700">{i18nBottleneck()}: </span>
        <span className="text-coal-700">{bottleneck}</span>
      </div>
    </div>
  );
}

function i18nBottleneck() {
  return "Most probable bottleneck";
}
