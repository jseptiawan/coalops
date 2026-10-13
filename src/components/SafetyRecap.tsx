"use client";
import { useI18n } from "@/lib/i18n";
import { Shield, AlertCircle, CheckCircle2, Clock, Activity, Heart } from "lucide-react";
import { safetyKPI, safetyIssues } from "@/lib/seed";
import { fmtNum, fmtPct } from "@/lib/aggregations";

export function SafetyRecap({ compact = false }: { compact?: boolean }) {
  const { t, lang } = useI18n();
  const s = safetyKPI;
  const openHigh = s.highRiskOpen > 0;

  if (compact) {
    return (
      <div
        className={`rounded-lg border-l-4 ${
          openHigh ? "border-red-500 bg-red-50" : "border-emerald-500 bg-emerald-50"
        } p-3 flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${openHigh ? "bg-red-100" : "bg-emerald-100"} flex items-center justify-center`}>
            <Shield size={20} className={openHigh ? "text-red-600" : "text-emerald-600"} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-coal-500">{t("safety.title")}</div>
            <div className="text-sm font-semibold">
              {t("safety.daysWithoutLTI")}: <span className="text-emerald-700">{s.daysWithoutLTI}</span> · LTIFR <span className="text-coal-700">{s.ltifr.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div>
            <div className="text-coal-500">{t("common.mtm")} {t("safety.manHours")}</div>
            <div className="font-semibold">{fmtNum(s.manHoursMTD)}</div>
          </div>
          <div>
            <div className="text-coal-500">{t("safety.openIssues")}</div>
            <div className={`font-semibold ${openHigh ? "text-red-600" : "text-coal-700"}`}>
              {s.openIssues} {openHigh && `(${s.highRiskOpen} ${t("safety.highRisk")})`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg border border-coal-200 p-4 mb-4">
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded ${openHigh ? "bg-red-100" : "bg-emerald-100"} flex items-center justify-center`}>
            <Shield size={20} className={openHigh ? "text-red-600" : "text-emerald-600"} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-wide">{t("safety.title")}</h2>
            <p className="text-[11px] text-coal-500">{t("safety.subtitle")}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${openHigh ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
          {openHigh ? (lang === "id" ? "PERHATIAN" : "ATTENTION") : (lang === "id" ? "AMAN" : "SAFE")}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-3">
        <Card icon={<Activity size={14} />} label={t("safety.daysWithoutLTI")} value={s.daysWithoutLTI.toString()} tone="emerald" />
        <Card icon={<Heart size={14} />} label={t("safety.daysWithoutFatality")} value={s.daysWithoutFatality.toString()} tone="emerald" />
        <Card icon={<Activity size={14} />} label={t("safety.ltifr")} value={s.ltifr.toFixed(2)} tone="emerald" />
        <Card icon={<Activity size={14} />} label={t("safety.trifr")} value={s.trifr.toFixed(2)} tone="emerald" />
        <Card icon={<Clock size={14} />} label={`${t("common.mtm")} ${t("safety.manHours")}`} value={fmtNum(s.manHoursMTD)} tone="default" />
        <Card icon={<Clock size={14} />} label={`${t("common.ytd")} ${t("safety.manHours")}`} value={fmtNum(s.manHoursYTD)} tone="default" />
        <Card icon={<Clock size={14} />} label={`${t("common.ltd")} ${t("safety.manHours")}`} value={fmtNum(s.manHoursLTD)} tone="default" />
        <Card icon={<CheckCircle2 size={14} />} label={t("safety.ppeCompliance")} value={fmtPct(s.ppeCompliancePct)} tone="default" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        <Pill label={t("safety.fatality")} value={s.counts.fatality} />
        <Pill label={t("safety.lti")} value={s.counts.lti} />
        <Pill label={t("safety.mtc")} value={s.counts.mtc} />
        <Pill label={t("safety.rwc")} value={s.counts.rwc} />
        <Pill label={t("safety.fac")} value={s.counts.fac} />
        <Pill label={t("safety.firstAid")} value={s.counts.firstAid} />
        <Pill label={t("safety.nearMiss")} value={s.counts.nearMiss} />
        <Pill label={t("safety.pdu")} value={s.counts.pdu} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-coal-100 text-xs">
        <Mini label={t("safety.tbtHeld")} value={s.tbtHeld.toString()} />
        <Mini label={t("safety.inspections")} value={`${s.inspectionsOpen} ${lang === "id" ? "buka" : "open"} / ${s.inspectionsClosed} ${lang === "id" ? "tutup" : "closed"}`} />
        <Mini label={t("safety.permitToWork")} value={s.permitsActive.toString()} />
        <Mini
          label={t("safety.openIssues")}
          value={
            <span className={openHigh ? "text-red-600 font-semibold" : "text-coal-700"}>
              {s.openIssues} {openHigh && `· ${s.highRiskOpen} ${t("safety.highRisk")}`}
            </span>
          }
        />
      </div>
    </section>
  );
}

function Card({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "emerald" | "default" }) {
  const toneCls = tone === "emerald" ? "border-emerald-200 bg-emerald-50/50" : "border-coal-200 bg-coal-50/50";
  return (
    <div className={`rounded border ${toneCls} p-2`}>
      <div className="flex items-center gap-1 text-coal-500 text-[10px]">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-coal-200 bg-white p-2 flex items-center justify-between">
      <span className="text-[11px] text-coal-500">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-coal-500 text-[10px] uppercase tracking-wider">{label}</span>
      <span className="font-semibold mt-0.5">{value}</span>
    </div>
  );
}
