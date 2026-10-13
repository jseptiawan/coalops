"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Period } from "@/lib/types";

interface PeriodCtx {
  period: Period;
  setPeriod: (p: Period) => void;
  date: string; // YYYY-MM-DD
  setDate: (d: string) => void;
}

const Ctx = createContext<PeriodCtx | null>(null);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [period, setPeriod] = useState<Period>("mtd");
  const [date, setDate] = useState<string>("2026-10-13");
  return (
    <Ctx.Provider value={{ period, setPeriod, date, setDate }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePeriod() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePeriod must be used inside PeriodProvider");
  return v;
}
