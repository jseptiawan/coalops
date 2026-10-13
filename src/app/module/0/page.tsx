"use client";
import { ModulePage } from "@/components/ModulePage";
import { SafetyRecap } from "@/components/SafetyRecap";
import { useI18n } from "@/lib/i18n";
import { safetyIssues, safetyKPI } from "@/lib/seed";
import { fmtPct } from "@/lib/aggregations";
import { Plus, Filter, Camera } from "lucide-react";

const riskLevelClass = (level: string) => {
  if (level === "High") return "bg-red-100 text-red-800 border-red-200";
  if (level === "Medium") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-emerald-100 text-emerald-800 border-emerald-200";
};

const statusClass = (status: string) => {
  if (status === "Open") return "bg-red-100 text-red-700";
  if (status === "InProgress") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
};

export default function Page() {
  const { t, lang } = useI18n();
  const s = safetyKPI;
  return (
    <ModulePage
      moduleKey="m0"
      moduleNumber={0}
      owner={lang === "id" ? "Kepala Departemen K3" : "HSE Department Head"}
      description={
        lang === "id"
          ? "Rekap K3 & isu-isu keselamatan. Selalu ditampilkan pertama di setiap dasbor dan laporan. Termasuk jam kerja manusia, LTI, LTIFR/TRIFR, kepatuhan APD, TBT, inspeksi, izin kerja, dan register isu K3."
          : "Safety Recap & safety issues. Always displayed first on every dashboard and report. Includes man-hours, LTI, LTIFR/TRIFR, PPE compliance, TBT, inspections, permit-to-work, and the safety issues register."
      }
    >
      <SafetyRecap />

      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <SubCard label={t("safety.ppeCompliance")} value={fmtPct(s.ppeCompliancePct)} />
          <SubCard label={t("safety.tbtHeld")} value={s.tbtHeld.toString()} suffix={lang === "id" ? "MTD" : "MTD"} />
          <SubCard
            label={t("safety.inspections")}
            value={`${s.inspectionsClosed} / ${s.inspectionsClosed + s.inspectionsOpen}`}
            suffix={lang === "id" ? "tertutup" : "closed"}
          />
        </div>
      </section>

      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200 flex items-center justify-between">
          <h2 className="text-sm font-bold">{t("safety.issues")}</h2>
          <div className="flex items-center gap-1">
            <button className="text-[11px] flex items-center gap-1 px-2 py-1 rounded hover:bg-coal-100">
              <Filter size={12} /> {t("common.filter")}
            </button>
            <button className="text-[11px] flex items-center gap-1 px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-coal-950 font-semibold">
              <Plus size={12} /> {t("safety.addIssue")}
            </button>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">ID</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.date")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.category")}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Deskripsi" : "Description"}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.location")}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Risiko" : "Risk"}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.pic")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.dueDate")}</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.status")}</th>
                <th className="px-3 py-2 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {safetyIssues.map((i) => (
                <tr key={i.id} className="border-t border-coal-100 hover:bg-coal-50">
                  <td className="px-3 py-2 font-mono text-[11px]">{i.id}</td>
                  <td className="px-3 py-2">{i.date}</td>
                  <td className="px-3 py-2">{i.category}</td>
                  <td className="px-3 py-2 max-w-md">{i.description}</td>
                  <td className="px-3 py-2">{i.location}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${riskLevelClass(i.riskLevel)}`}>
                      {i.riskLevel}
                    </span>
                  </td>
                  <td className="px-3 py-2">{i.pic}</td>
                  <td className="px-3 py-2">{i.dueDate}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusClass(i.status)}`}>
                      {i.status === "Open" ? t("common.open") : i.status === "InProgress" ? t("common.inProgress") : t("common.closed")}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button className="p-1 hover:bg-coal-100 rounded" title="Photo">
                      <Camera size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ModulePage>
  );
}

function SubCard({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-lg border border-coal-200 p-3 bg-coal-50/50">
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold mt-0.5">
        {value} {suffix && <span className="text-xs text-coal-500 font-normal">{suffix}</span>}
      </div>
    </div>
  );
}
