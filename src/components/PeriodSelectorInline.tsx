"use client";
import { usePeriod } from "@/lib/period";
import { useI18n } from "@/lib/i18n";
import { Calendar, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Period } from "@/lib/types";

const periodKey: Record<Period, "daily" | "yesterday" | "mtd" | "ytd" | "ltd"> = {
  daily: "daily",
  yesterday: "yesterday",
  mtd: "mtd",
  ytd: "ytd",
  ltd: "ltd",
};

export function PeriodSelectorInline() {
  const { period, setPeriod, date, setDate } = usePeriod();
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  const periods: Period[] = ["daily", "yesterday", "mtd", "ytd", "ltd"];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-coal-200 bg-white hover:bg-coal-50"
      >
        <Calendar size={14} className="text-coal-500" />
        <span className="font-medium">{t(`periods.${periodKey[period]}`)}</span>
        <span className="text-coal-500 text-xs hidden sm:inline">· {date}</span>
        <ChevronDown size={14} className="text-coal-500" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-56 rounded-md border border-coal-200 bg-white shadow-lg z-50 p-2">
          <div className="text-[10px] text-coal-500 uppercase tracking-wider px-2 mb-1">
            {t("common.period")}
          </div>
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setOpen(false);
              }}
              className={`w-full text-left px-2 py-1.5 text-sm rounded ${
                period === p ? "bg-amber-100 text-amber-800 font-semibold" : "hover:bg-coal-100"
              }`}
            >
              {t(`periods.${periodKey[p]}`)}
            </button>
          ))}
          <div className="border-t my-2"></div>
          <div className="text-[10px] text-coal-500 uppercase tracking-wider px-2 mb-1">
            {t("common.selectDate")}
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-coal-200 rounded"
          />
          <div className="text-[10px] text-coal-400 px-2 mt-1">
            {lang === "id" ? "Standar waktu: Asia/Jakarta (WIB)" : "Time standard: Asia/Jakarta (WIB)"}
          </div>
        </div>
      )}
    </div>
  );
}
