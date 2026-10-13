import type { ProductionActual, Period, ProductionStage } from "./types";
import { achColor } from "./types";

export const STAGE_KEYS: ProductionStage[] = [
  "loadToBarge",
  "coalHauling",
  "coalGetting",
  "obRemoval",
  "drillingBlasting",
  "landClearing",
];

export function getDateRange(period: Period, today: Date = new Date()): { start: Date; end: Date; label: string } {
  const start = new Date(today);
  const end = new Date(today);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  switch (period) {
    case "daily":
      return { start, end, label: today.toISOString().slice(0, 10) };
    case "yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      const yStart = new Date(y);
      yStart.setHours(0, 0, 0, 0);
      const yEnd = new Date(y);
      yEnd.setHours(23, 59, 59, 999);
      return { start: yStart, end: yEnd, label: y.toISOString().slice(0, 10) };
    }
    case "mtd": {
      const s = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: s, end, label: `${today.toISOString().slice(0, 7)} MTD` };
    }
    case "ytd": {
      const s = new Date(today.getFullYear(), 0, 1);
      return { start: s, end, label: `${today.getFullYear()} YTD` };
    }
    case "ltd": {
      const s = new Date("2020-01-01");
      return { start: s, end, label: "Life-to-Date" };
    }
  }
}

export function isInRange(dateStr: string, range: { start: Date; end: Date }): boolean {
  const d = new Date(dateStr + "T00:00:00");
  return d >= range.start && d <= range.end;
}

export interface StageAggregate {
  stage: ProductionStage;
  plan: number;
  actual: number;
  pct: number;
  unit: "tonnes" | "bcm" | "meters" | "ha" | "m3";
  yesterday: number;
  trend: number[]; // last 14 days actuals for sparkline
}

export function aggregateStage(
  stage: ProductionStage,
  data: ProductionActual[],
  period: Period,
  today: Date = new Date()
): StageAggregate {
  const range = getDateRange(period, today);
  const inRange = data.filter((r) => r.stage === stage && isInRange(r.date, range));

  // For OB we use BCM; for drilling meters; for land clearing Ha; otherwise tonnes
  const useBCM = stage === "obRemoval";
  const useMeters = stage === "drillingBlasting";
  const useHa = stage === "landClearing";
  const useM3 = stage === "landClearing"; // for topsoil display

  const plan = inRange.reduce((a, r) => a + (useBCM ? r.planBCM || 0 : useMeters ? r.planTonnes : useHa ? r.planTonnes : r.planTonnes), 0);
  const actual = inRange.reduce((a, r) => a + (useBCM ? r.actualBCM || 0 : useMeters ? r.actualTonnes : useHa ? r.actualTonnes : r.actualTonnes), 0);

  // Yesterday
  const yRange = getDateRange("yesterday", today);
  const yesterday = data
    .filter((r) => r.stage === stage && isInRange(r.date, yRange))
    .reduce((a, r) => a + (useBCM ? r.actualBCM || 0 : r.actualTonnes), 0);

  // Trend last 14 days
  const trend: number[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const v = data
      .filter((r) => r.stage === stage && r.date === ds)
      .reduce((a, r) => a + (useBCM ? r.actualBCM || 0 : r.actualTonnes), 0);
    trend.push(v);
  }

  const pct = plan > 0 ? (actual / plan) * 100 : 0;
  const unit: StageAggregate["unit"] = useBCM ? "bcm" : useMeters ? "meters" : useHa ? "ha" : "tonnes";

  return { stage, plan, actual, pct, unit, yesterday, trend };
}

export interface ProcessChainNode {
  key: ProductionStage;
  order: number;
  actual: number;
  plan: number;
  pct: number;
  ach: ReturnType<typeof achColor>;
  trend: number[];
}

export function buildProcessChain(data: ProductionActual[], period: Period, today: Date = new Date()): ProcessChainNode[] {
  // Backward tracing: order from downstream to upstream
  // loadToBarge → coalHauling → coalGetting → obRemoval → drillingBlasting → landClearing
  const order: ProductionStage[] = [
    "loadToBarge",
    "coalHauling",
    "coalGetting",
    "obRemoval",
    "drillingBlasting",
    "landClearing",
  ];
  return order.map((stage, i) => {
    const agg = aggregateStage(stage, data, period, today);
    return {
      key: stage,
      order: i,
      actual: agg.actual,
      plan: agg.plan,
      pct: agg.pct,
      ach: achColor(agg.pct),
      trend: agg.trend,
    };
  });
}

export function fmtNum(n: number, digits = 0): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(digits);
}

export function fmtPct(n: number, digits = 1): string {
  if (!isFinite(n)) return "—";
  return n.toFixed(digits) + "%";
}

export function fmtIDR(n: number): string {
  if (!isFinite(n)) return "—";
  return "Rp " + fmtNum(n);
}

export function fmtUSD(n: number): string {
  if (!isFinite(n)) return "—";
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
