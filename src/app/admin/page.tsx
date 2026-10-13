"use client";
import { useI18n } from "@/lib/i18n";
import { initInfo } from "@/lib/seed";
import { Settings, Check, Database, FileText, Users as UsersIcon, AlertTriangle, Lock, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminPage() {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(3);
  const steps = [
    { label: "Scenario", icon: <KeyRound size={14} /> },
    { label: "Cutoff Date", icon: <Database size={14} /> },
    { label: "Opening Balances", icon: <FileText size={14} /> },
    { label: "Imports", icon: <FileText size={14} /> },
    { label: "Lock & Audit", icon: <Lock size={14} /> },
  ];

  return (
    <div className="space-y-3 max-w-[1200px] mx-auto">
      <header className="bg-white rounded-lg border border-coal-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Settings size={18} className="text-amber-600" />
            {t("init.title")}
          </h1>
          <p className="text-xs text-coal-500 mt-1">
            {lang === "id"
              ? "Pengaturan awal untuk tambang baru atau yang sudah berjalan. Lock setelah selesai; koreksi oleh Admin dicatat sebagai audited adjustment."
              : "First-run setup for new or mid-life onboarded mines. Lock after completion; later corrections by Admin are logged as audited adjustments."}
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1">
          <Lock size={10} /> {lang === "id" ? "Terkunci" : "LOCKED"}
        </span>
      </header>

      {/* Wizard stepper */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <div className="flex items-center gap-1 mb-4">
          {steps.map((s, i) => {
            const done = i < step;
            const cur = i === step;
            return (
              <div key={i} className="flex items-center flex-1">
                <div className={`flex items-center gap-1 px-2 py-1.5 rounded text-[11px] font-semibold w-full ${
                  done ? "bg-emerald-100 text-emerald-700" : cur ? "bg-amber-100 text-amber-700" : "bg-coal-100 text-coal-500"
                }`}>
                  {done ? <Check size={12} /> : s.icon}
                  <span className="truncate">{i + 1}. {s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 w-4 ${done ? "bg-emerald-300" : "bg-coal-200"}`}></div>}
              </div>
            );
          })}
        </div>

        {/* Scenario */}
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <div className={`rounded-lg border-2 p-3 ${initInfo.scenario !== "mid-life" ? "border-coal-200" : "border-amber-400 bg-amber-50/40"}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase text-coal-500">{t("init.scenario")}</div>
                <div className="text-sm font-bold">{t("init.midLife")}</div>
              </div>
              <Check size={18} className="text-emerald-600" />
            </div>
            <p className="text-[11px] text-coal-600 mt-1">
              {lang === "id" ? "Tambang yang sudah ada, mulai menggunakan sistem. Saldo awal dimasukkan per modul." : "Existing mine starting to use the system. Opening balances entered per module."}
            </p>
          </div>
          <div className="rounded-lg border-2 border-coal-200 p-3 opacity-60">
            <div className="text-[10px] uppercase text-coal-500">{t("init.scenario")}</div>
            <div className="text-sm font-bold">{t("init.newMine")}</div>
            <p className="text-[11px] text-coal-600 mt-1">
              {lang === "id" ? "Saldo awal = 0; LTD dihitung dari hari 1." : "Opening balances = 0; LTD counted from day 1."}
            </p>
          </div>
        </div>

        {/* Cutoff */}
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <Field label={lang === "id" ? "Tanggal Mulai Tambang" : "Mine Start Date"} value={initInfo.mineStart} />
          <Field label={t("init.cutoff")} value={initInfo.onboardingCutoff} />
          <Field label={lang === "id" ? "Mata Uang" : "Currency"} value={initInfo.currency} />
        </div>

        {/* Opening balance checkboxes */}
        <div className="rounded-lg border border-coal-200 p-3">
          <div className="text-sm font-bold mb-2">{t("init.openBalances")}</div>
          <div className="grid md:grid-cols-2 gap-2 text-xs">
            {[
              { m: "M0", label: "Safety – man-hours, LTI streak, issues", checked: true },
              { m: "M1-M7", label: "Production – LTD volume per stage (survey-adjusted)", checked: true },
              { m: "M8", label: "Fleet – opening HM per unit, status", checked: true },
              { m: "M9-M10", label: "Maintenance – opening backlog, open WOs", checked: true },
              { m: "M11", label: "HR – employee master (CSV import, 542 employees)", checked: true },
              { m: "M12", label: "Engineering – opening survey volumes per pit", checked: true },
              { m: "M13", label: "Environment – rehabilitated area, waste, permits", checked: true },
              { m: "M14", label: "Quality – opening per stockpile, LTD stats", checked: true },
              { m: "M15", label: "Sales – LTD delivered, DMO, royalty, ref prices", checked: true },
              { m: "M16", label: "Cost – MTD/YTD consumed, open POs, FX rate", checked: true },
              { m: "M17", label: "Coal Account – opening stock (consistency w/ M1+M12)", checked: true },
              { m: "M18", label: "Risk Register – CSV import (15–20 existing risks)", checked: true },
            ].map((it, i) => (
              <label key={i} className="flex items-center gap-2 p-2 rounded hover:bg-coal-50">
                <input type="checkbox" checked={it.checked} readOnly className="rounded" />
                <span className="font-mono text-coal-500 w-16">{it.m}</span>
                <span>{it.label}</span>
                {it.checked && <Check size={12} className="ml-auto text-emerald-600" />}
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-3">
        <Link
          href="/admin/users"
          className="bg-white rounded-lg border border-coal-200 p-4 hover:shadow flex items-center gap-3"
        >
          <UsersIcon size={20} className="text-amber-600" />
          <div>
            <div className="font-bold text-sm">Users & Roles</div>
            <p className="text-[11px] text-coal-500">Admin, GM, Dept Heads (per module ownership), Viewer</p>
          </div>
        </Link>
        <Link
          href="/admin/audit"
          className="bg-white rounded-lg border border-coal-200 p-4 hover:shadow flex items-center gap-3"
        >
          <AlertTriangle size={20} className="text-amber-600" />
          <div>
            <div className="font-bold text-sm">Audit Log</div>
            <p className="text-[11px] text-coal-500">{lang === "id" ? "Pengguna, timestamp, nilai lama/baru" : "User, timestamp, old/new value"}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}
