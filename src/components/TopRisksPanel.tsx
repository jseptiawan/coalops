"use client";
import { useI18n } from "@/lib/i18n";
import { risks } from "@/lib/seed";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

const levelClass = (n: number) => {
  if (n >= 15) return "bg-red-100 text-red-800 border-red-300";
  if (n >= 9) return "bg-orange-100 text-orange-800 border-orange-300";
  if (n >= 4) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-emerald-100 text-emerald-800 border-emerald-300";
};

export function TopRisksPanel() {
  const { t, lang } = useI18n();
  const top = [...risks]
    .filter((r) => r.status !== "Closed")
    .map((r) => ({ ...r, level: r.residualLikelihood * r.residualSeverity }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg border border-coal-200 p-4">
      <header className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600" />
          {t("risk.top")}
        </h2>
        <Link href="/module/18" className="text-[11px] text-amber-700 hover:underline">
          {lang === "id" ? "Lihat semua" : "View all"} →
        </Link>
      </header>
      <ul className="space-y-1.5">
        {top.map((r) => (
          <li key={r.id} className="flex items-center gap-2 text-xs">
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold w-10 text-center ${levelClass(r.level)}`}>
              {r.level}
            </span>
            <div className="flex-1 min-w-0">
              <div className="truncate font-semibold text-coal-800">{r.title}</div>
              <div className="text-[10px] text-coal-500">
                {r.ownerDept} · L{r.residualLikelihood}×S{r.residualSeverity} · {r.status}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
