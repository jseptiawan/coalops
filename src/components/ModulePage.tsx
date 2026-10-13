"use client";
import { SafetyRecap } from "@/components/SafetyRecap";
import { useI18n } from "@/lib/i18n";
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface ModulePageProps {
  moduleKey: string; // e.g. "m0"
  moduleNumber: number;
  owner: string;
  description: string;
  crumbs?: Crumb[];
  children: ReactNode;
}

export function ModulePage({ moduleKey, moduleNumber, owner, description, crumbs, children }: ModulePageProps) {
  const { t, lang } = useI18n();
  return (
    <div className="space-y-3 max-w-[1600px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[11px] text-coal-500">
        <Link href="/" className="hover:text-coal-900 flex items-center gap-1">
          <Home size={11} /> {t("nav.dashboard")}
        </Link>
        <ChevronRight size={11} />
        <span className="text-coal-700 font-semibold">
          {t(`modules.${moduleKey}`)}
        </span>
      </nav>

      {/* Safety FIRST */}
      <SafetyRecap compact />

      {/* Module header */}
      <header className="bg-white rounded-lg border border-coal-200 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-coal-500">
              {lang === "id" ? "Modul" : "Module"} {moduleNumber}
            </div>
            <h1 className="text-lg font-bold">{t(`modules.${moduleKey}`)}</h1>
            <p className="text-xs text-coal-500 mt-1 max-w-2xl">{description}</p>
          </div>
          <div className="text-right text-[11px]">
            <div className="text-coal-500 uppercase tracking-wider">{t("common.owner")}</div>
            <div className="font-semibold">{owner}</div>
            <div className="mt-1 inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {lang === "id" ? "Aktif" : "Active"}
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
