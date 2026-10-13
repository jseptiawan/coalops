"use client";
import { useI18n } from "@/lib/i18n";
import { dashboardKPIs } from "@/lib/seed";
import { fmtPct, fmtNum } from "@/lib/aggregations";
import Link from "next/link";
import { Activity, Truck, Wrench, Users, ShieldCheck, Beaker, Leaf, AlertTriangle, Briefcase, Banknote } from "lucide-react";

const chip = "flex-shrink-0 w-44 rounded-lg border border-coal-200 bg-white p-2.5 hover:shadow transition cursor-pointer";

export function SupportKPIStrip() {
  const { t, lang } = useI18n();
  const k = dashboardKPIs;
  const maTone = k.siteMA >= k.targets.ma ? "emerald" : k.siteMA >= k.targets.ma - 5 ? "amber" : "red";
  const toneCls = (tone: "emerald" | "amber" | "red") => {
    if (tone === "emerald") return "text-emerald-700";
    if (tone === "amber") return "text-amber-700";
    return "text-red-700";
  };

  return (
    <div className="bg-white rounded-lg border border-coal-200 p-3">
      <header className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold">{t("dashboard.supportKpi")}</h2>
        <span className="text-[10px] text-coal-500 uppercase tracking-wider">
          {lang === "id" ? "Gulir horizontal" : "Scroll horizontally"}
        </span>
      </header>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link href="/module/9" className={chip}>
          <div className="flex items-center gap-1.5 text-coal-500 text-[10px]">
            <Activity size={12} /> {t("kpi.ma")}
          </div>
          <div className={`text-xl font-bold ${toneCls(maTone)}`}>
            {fmtPct(k.siteMA, 1)}
          </div>
          <div className="text-[10px] text-coal-500">
            {lang === "id" ? "Target" : "Target"} {k.targets.ma}% · PA {k.sitePA}% · EU {k.siteEU}%
          </div>
        </Link>
        <Link href="/module/8" className={chip}>
          <div className="flex items-center gap-1.5 text-coal-500 text-[10px]">
            <Truck size={12} /> {lang === "id" ? "Armada Siap" : "Fleet Ready"}
          </div>
          <div className="text-xl font-bold">{k.fleetReady} <span className="text-coal-400 text-sm">/ {k.totalEquipment}</span></div>
          <div className="text-[10px] text-coal-500">{lang === "id" ? "Siap operasi" : "Ready to operate"}</div>
        </Link>
        <Link href="/module/10" className={chip}>
          <div className="flex items-center gap-1.5 text-coal-500 text-[10px]">
            <Wrench size={12} /> {lang === "id" ? "WO Terbuka" : "Open WOs"}
          </div>
          <div className="text-xl font-bold">{k.openWOs}</div>
          <div className="text-[10px] text-coal-500">{fmtNum(k.backlogHours)} {t("kpi.backlogHours")}</div>
        </Link>
        <Link href="/module/11" className={chip}>
          <div className="flex items-center gap-1.5 text-coal-500 text-[10px]">
            <Users size={12} /> {lang === "id" ? "Hadir" : "Manpower Present"}
          </div>
          <div className="text-xl font-bold">{fmtPct(k.manpowerPresentPct, 1)}</div>
          <div className="text-[10px] text-coal-500">{k.certExpiring30d} {lang === "id" ? "sertif ≤30hr" : "certs ≤30d"}</div>
        </Link>
        <Link href="/module/14" className={chip}>
          <div className="flex items-center gap-1.5 text-coal-500 text-[10px]">
            <Beaker size={12} /> {lang === "id" ? "Kepatuhan Spec" : "Spec Compliance"}
          </div>
          <div className="text-xl font-bold">{fmtPct(k.qualitySpecCompliancePct, 0)}</div>
          <div className="text-[10px] text-coal-500">{lang === "id" ? "7 sampel terakhir" : "last 7 samples"}</div>
        </Link>
        <Link href="/module/13" className={chip}>
          <div className="flex items-center gap-1.5 text-coal-500 text-[10px]">
            <Leaf size={12} /> {lang === "id" ? "Alert Lingkungan" : "Env Alerts"}
          </div>
          <div className={`text-xl font-bold ${k.openEnvAlerts > 0 ? "text-red-600" : "text-emerald-600"}`}>
            {k.openEnvAlerts}
          </div>
          <div className="text-[10px] text-coal-500">{lang === "id" ? "Pelanggaran aktif" : "Active exceedances"}</div>
        </Link>
        <Link href="/module/18" className={chip}>
          <div className="flex items-center gap-1.5 text-coal-500 text-[10px]">
            <AlertTriangle size={12} /> {lang === "id" ? "Risiko Tinggi" : "High Risks"}
          </div>
          <div className={`text-xl font-bold ${k.openHighRisks > 0 ? "text-red-600" : "text-emerald-600"}`}>
            {k.openHighRisks}
          </div>
          <div className="text-[10px] text-coal-500">{lang === "id" ? "Sisa tinggi" : "Residual high"}</div>
        </Link>
        <Link href="/module/15" className={chip}>
          <div className="flex items-center gap-1.5 text-coal-500 text-[10px]">
            <Briefcase size={12} /> {lang === "id" ? "Penjualan vs Kontrak" : "Sales vs Contract"}
          </div>
          <div className={`text-xl font-bold ${k.salesVsContractPct >= 95 ? "text-emerald-700" : "text-amber-700"}`}>
            {fmtPct(k.salesVsContractPct, 0)}
          </div>
          <div className="text-[10px] text-coal-500">DMO {fmtPct(k.dmoCompliancePct, 0)}</div>
        </Link>
        <Link href="/module/16" className={chip}>
          <div className="flex items-center gap-1.5 text-coal-500 text-[10px]">
            <Banknote size={12} /> {t("common.ytd")} {lang === "id" ? "Penyerapan" : "Burn"}
          </div>
          <div className={`text-xl font-bold ${k.budgetBurnYtdPct > 100 ? "text-red-600" : k.budgetBurnYtdPct > 90 ? "text-amber-700" : "text-emerald-700"}`}>
            {fmtPct(k.budgetBurnYtdPct, 0)}
          </div>
          <div className="text-[10px] text-coal-500">{lang === "id" ? "Anggaran vs realisasi" : "Budget vs actual"}</div>
        </Link>
      </div>
    </div>
  );
}
