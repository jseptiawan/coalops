"use client";
import { usePeriod } from "@/lib/period";
import { useI18n } from "@/lib/i18n";
import { aggregateStage, buildProcessChain, fmtNum, fmtPct } from "@/lib/aggregations";
import { productionActuals } from "@/lib/seed";
import { ChevronRight, AlertTriangle, ArrowRight } from "lucide-react";
import { Sparkline } from "./Sparkline";
import Link from "next/link";
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

const stageHref: Record<ProductionStage, string> = {
  loadToBarge: "/module/1",
  coalHauling: "/module/2",
  crushing: "/module/3",
  coalGetting: "/module/4",
  obRemoval: "/module/5",
  drillingBlasting: "/module/6",
  landClearing: "/module/7",
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

const achTextClass = (ach: "green" | "yellow" | "red" | "grey") => {
  if (ach === "green") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (ach === "yellow") return "text-amber-700 bg-amber-50 border-amber-200";
  if (ach === "red") return "text-red-700 bg-red-50 border-red-200";
  return "text-coal-700 bg-coal-50 border-coal-200";
};

export function ProcessChain() {
  const { period } = usePeriod();
  const { t, lang } = useI18n();
  const chain = buildProcessChain(productionActuals, period);

  return (
    <div className="bg-white rounded-lg border border-coal-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <ArrowRight size={16} className="text-amber-600" />
          {t("dashboard.processChain")}
        </h2>
        <div className="text-[10px] text-coal-500">
          {lang === "id"
            ? "← Hilir (Jauh) … Hulu (Awal) →"
            : "← Downstream … Upstream →"}
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-1.5">
        {chain.map((node, i) => {
          const label = t(stageKey[node.key]);
          const ach = node.ach;
          return (
            <div key={node.key} className="flex items-stretch">
              <Link
                href={stageHref[node.key]}
                className={`group flex-1 min-w-[140px] max-w-[180px] rounded border ${achTextClass(ach)} p-2 hover:shadow-md transition`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold uppercase tracking-wider">M{i + 1}</span>
                  <span className="font-semibold">
                    {node.pct === 0 ? "—" : fmtPct(node.pct, 0)}
                  </span>
                </div>
                <div className="text-sm font-semibold mt-0.5 truncate">{label}</div>
                <div className="mt-1.5 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-coal-500">{t("common.actual")}</div>
                    <div className="text-sm font-bold">
                      {fmtNum(node.actual)}
                      <span className="text-[10px] text-coal-500 font-normal ml-0.5">
                        {stageUnit[node.key]}
                      </span>
                    </div>
                  </div>
                  <Sparkline data={node.trend} width={48} height={20} />
                </div>
                <div className="text-[10px] text-coal-500 mt-1 truncate">
                  {t("common.plan")} {fmtNum(node.plan)}
                </div>
              </Link>
              {i < chain.length - 1 && (
                <div className="flex items-center px-0.5 text-coal-300">
                  <ChevronRight size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-coal-500 mt-2">
        {t("dashboard.clickNode")}
      </p>
    </div>
  );
}
