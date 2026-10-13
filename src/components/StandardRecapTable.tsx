"use client";
import { usePeriod } from "@/lib/period";
import { useI18n } from "@/lib/i18n";
import { aggregateStage, fmtNum, fmtPct, STAGE_KEYS } from "@/lib/aggregations";
import { productionActuals } from "@/lib/seed";
import { achColor } from "@/lib/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ProductionStage } from "@/lib/types";

const stageKey: Record<ProductionStage, string> = {
  loadToBarge: "production.loadToBarge",
  coalHauling: "production.coalHauling",
  crushing: "production.crushing",
  coalGetting: "production.coalGetting",
  obRemoval: "production.obRemoval",
  drillingBlasting: "production.drillingBlasting",
  landClearing: "production.landClearing",
};

const stageUnit: Record<ProductionStage, string> = {
  loadToBarge: "t",
  coalHauling: "t",
  crushing: "t",
  coalGetting: "t",
  obRemoval: "BCM",
  drillingBlasting: "m",
  landClearing: "Ha",
};

export function StandardRecapTable() {
  const { period } = usePeriod();
  const { t, lang } = useI18n();

  const today = new Date("2026-10-13T00:00:00+07:00");
  const todayAgg = (s: ProductionStage) => aggregateStage(s, productionActuals, "daily", today);
  const yestAgg = (s: ProductionStage) => aggregateStage(s, productionActuals, "yesterday", today);
  const mtdAgg = (s: ProductionStage) => aggregateStage(s, productionActuals, "mtd", today);
  const ytdAgg = (s: ProductionStage) => aggregateStage(s, productionActuals, "ytd", today);
  const ltdAgg = (s: ProductionStage) => aggregateStage(s, productionActuals, "ltd", today);

  return (
    <div className="bg-white rounded-lg border border-coal-200 overflow-hidden">
      <header className="px-4 py-3 border-b border-coal-200 flex items-center justify-between">
        <h2 className="text-sm font-bold">{t("dashboard.recap")}</h2>
        <span className="text-[10px] text-coal-500 uppercase tracking-wider">
          {lang === "id" ? "Format standar global" : "Global standard format"}
        </span>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-coal-100 text-coal-600">
              <th className="px-3 py-2 text-left font-semibold sticky left-0 bg-coal-100 z-10">
                {lang === "id" ? "Tahap" : "Stage"}
              </th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.today")}</th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.yesterday")}</th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.vsYesterday")}</th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.mtm")} {t("common.plan")}</th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.mtm")} {t("common.actual")}</th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.mtm")} %</th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.ytd")} {t("common.plan")}</th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.ytd")} {t("common.actual")}</th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.ytd")} %</th>
              <th className="px-2 py-2 text-right font-semibold">{t("common.ltd")}</th>
              <th className="px-2 py-2 text-center font-semibold">{t("common.status")}</th>
            </tr>
          </thead>
          <tbody>
            {STAGE_KEYS.map((stage) => {
              const tdy = todayAgg(stage);
              const yst = yestAgg(stage);
              const mtd = mtdAgg(stage);
              const ytd = ytdAgg(stage);
              const ltd = ltdAgg(stage);
              const delta = tdy.actual - yst.actual;
              const deltaPct = yst.actual > 0 ? (delta / yst.actual) * 100 : 0;
              const ach = achColor(mtd.pct);
              return (
                <tr key={stage} className="border-t border-coal-100 hover:bg-coal-50">
                  <td className="px-3 py-2 font-semibold sticky left-0 bg-white z-10 whitespace-nowrap">
                    {t(stageKey[stage])}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {fmtNum(tdy.actual)} <span className="text-coal-400">{stageUnit[stage]}</span>
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {fmtNum(yst.actual)} <span className="text-coal-400">{stageUnit[stage]}</span>
                  </td>
                  <td className={`px-2 py-2 text-right tabular-nums ${delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-600" : "text-coal-500"}`}>
                    <span className="inline-flex items-center gap-0.5">
                      {delta > 0 ? <TrendingUp size={11} /> : delta < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
                      {fmtPct(Math.abs(deltaPct), 1)}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-coal-500">
                    {fmtNum(mtd.plan)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {fmtNum(mtd.actual)}
                  </td>
                  <td className={`px-2 py-2 text-right tabular-nums font-semibold ${
                    ach === "green" ? "text-emerald-700" : ach === "yellow" ? "text-amber-700" : "text-red-700"
                  }`}>
                    {mtd.plan > 0 ? fmtPct(mtd.pct, 0) : "—"}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-coal-500">
                    {fmtNum(ytd.plan)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {fmtNum(ytd.actual)}
                  </td>
                  <td className={`px-2 py-2 text-right tabular-nums font-semibold ${
                    ach === "green" ? "text-emerald-700" : ach === "yellow" ? "text-amber-700" : "text-red-700"
                  }`}>
                    {ytd.plan > 0 ? fmtPct(ytd.pct, 0) : "—"}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-coal-700">
                    {fmtNum(ltd.actual)}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ach === "green" ? "bg-emerald-100 text-emerald-700" :
                      ach === "yellow" ? "bg-amber-100 text-amber-700" :
                      ach === "red" ? "bg-red-100 text-red-700" :
                      "bg-coal-100 text-coal-600"
                    }`}>
                      {ach === "green" ? (lang === "id" ? "OK" : "OK") :
                       ach === "yellow" ? (lang === "id" ? "WASPADA" : "WARN") :
                       ach === "red" ? (lang === "id" ? "BAHAYA" : "ALERT") :
                       (lang === "id" ? "—" : "—")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
