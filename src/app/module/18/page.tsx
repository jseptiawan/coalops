"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { risks } from "@/lib/seed";
import { AlertTriangle, Plus } from "lucide-react";
import { useState } from "react";

const levelClass = (n: number) => {
  if (n >= 15) return "bg-red-200 text-red-900 border-red-400";
  if (n >= 9) return "bg-orange-200 text-orange-900 border-orange-400";
  if (n >= 4) return "bg-yellow-200 text-yellow-900 border-yellow-400";
  return "bg-emerald-200 text-emerald-900 border-emerald-400";
};

const statusClass = (s: string) => {
  if (s === "Identified") return "bg-coal-100 text-coal-700";
  if (s === "Assessed") return "bg-blue-100 text-blue-700";
  if (s === "Treating") return "bg-amber-100 text-amber-700";
  if (s === "Monitored") return "bg-emerald-100 text-emerald-700";
  return "bg-coal-200 text-coal-800";
};

export default function Page() {
  const { t, lang } = useI18n();
  const [view, setView] = useState<"inherent" | "residual">("residual");

  // 5x5 heatmap
  const cells: { L: number; S: number; inherent: number; residual: number }[] = [];
  for (let L = 5; L >= 1; L--) {
    for (let S = 1; S <= 5; S++) {
      const inh = risks.filter((r) => r.likelihood === L && r.severity === S);
      const res = risks.filter((r) => r.residualLikelihood === L && r.residualSeverity === S);
      cells.push({ L, S, inherent: inh.length, residual: res.length });
    }
  }

  const cellClass = (L: number, S: number) => {
    const n = L * S;
    if (n >= 15) return "bg-red-200 hover:bg-red-300";
    if (n >= 9) return "bg-orange-200 hover:bg-orange-300";
    if (n >= 4) return "bg-yellow-200 hover:bg-yellow-300";
    return "bg-emerald-200 hover:bg-emerald-300";
  };

  return (
    <ModulePage
      moduleKey="m18"
      moduleNumber={18}
      owner={lang === "id" ? "Lintas departemen (setiap Dept Head untuk departemennya sendiri); dikelola oleh GM/Admin, HSE sebagai koordinator" : "Cross-department (each Dept Head for their own); administered by GM/Admin, HSE as coordinator"}
      description={
        lang === "id"
          ? "Register risiko dengan matriks 5×5 inherent vs residual. Indikator Risiko Utama (KRI) otomatis dari modul 1-17. Risiko yang disarankan dari anomali (MA rendah, varians di luar toleransi, tongkang off-spec, dll). Status: Identified → Assessed → Treating → Monitored → Closed. Penutupan memerlukan persetujuan GM."
          : "Risk register with 5×5 matrix inherent vs residual. Auto KRI from modules 1-17. Suggested risks from anomalies (low MA, out-of-tolerance variance, off-spec barges, etc). Status: Identified → Assessed → Treating → Monitored → Closed. Closure requires GM approval."
      }
    >
      <div className="grid lg:grid-cols-3 gap-3">
        {/* Heatmap */}
        <section className="bg-white rounded-lg border border-coal-200 p-4 lg:col-span-2">
          <header className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-600" />
              {t("risk.matrix")} ({view === "inherent" ? t("risk.inherent") : t("risk.residual")})
            </h3>
            <div className="flex items-center gap-1 text-[11px] bg-coal-100 rounded p-0.5">
              <button
                onClick={() => setView("inherent")}
                className={`px-2 py-0.5 rounded ${view === "inherent" ? "bg-white shadow font-semibold" : ""}`}
              >
                {t("risk.inherent")}
              </button>
              <button
                onClick={() => setView("residual")}
                className={`px-2 py-0.5 rounded ${view === "residual" ? "bg-white shadow font-semibold" : ""}`}
              >
                {t("risk.residual")}
              </button>
            </div>
          </header>
          <div className="grid grid-cols-6 gap-1 text-[10px] text-center">
            <div></div>
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="font-semibold text-coal-500">S{s}</div>
            ))}
            {[5, 4, 3, 2, 1].map((L) => (
              <>
                <div key={`r${L}`} className="font-semibold text-coal-500">L{L}</div>
                {[1, 2, 3, 4, 5].map((S) => {
                  const cell = cells.find((c) => c.L === L && c.S === S);
                  const count = cell ? (view === "inherent" ? cell.inherent : cell.residual) : 0;
                  return (
                    <div
                      key={`c${L}${S}`}
                      className={`aspect-square rounded ${cellClass(L, S)} flex items-center justify-center font-bold text-coal-900 cursor-pointer`}
                      title={`L${L} × S${S} = ${L * S}`}
                    >
                      {count > 0 ? count : ""}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </section>

        {/* KRI Dashboard */}
        <section className="bg-white rounded-lg border border-coal-200 p-4">
          <h3 className="text-sm font-bold mb-2">{t("risk.kri")}</h3>
          <ul className="text-xs space-y-1.5">
            {[
              { k: "MA < target 3d", v: "78%", target: "85%", s: "red" },
              { k: "DMO compliance", v: "92%", target: "100%", s: "amber" },
              { k: "Off-spec shipments", v: "1", target: "0", s: "red" },
              { k: "Env exceedances", v: "1", target: "0", s: "red" },
              { k: "Backlog", v: "178h", target: "≤120h", s: "amber" },
              { k: "Budget overrun", v: "108%", target: "≤100%", s: "red" },
            ].map((k, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  k.s === "red" ? "bg-red-500" : k.s === "amber" ? "bg-amber-500" : "bg-emerald-500"
                }`}></span>
                <span className="flex-1">{k.k}</span>
                <span className="font-semibold">{k.v}</span>
                <span className="text-coal-400">/ {k.target}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Register table */}
      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200 flex items-center justify-between">
          <h2 className="text-sm font-bold">{t("risk.register")}</h2>
          <button className="text-[11px] px-2 py-1 rounded bg-amber-500 text-coal-950 font-semibold flex items-center gap-1">
            <Plus size={12} /> {t("risk.add")}
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">ID</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Judul" : "Title"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Kategori" : "Category"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Pemilik" : "Owner"}</th>
                <th className="px-3 py-2 text-center font-semibold">L×S (I)</th>
                <th className="px-3 py-2 text-center font-semibold">L×S (R)</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.status")}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Tindakan" : "Treatment"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Batas" : "Due"}</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r) => {
                const inh = r.likelihood * r.severity;
                const res = r.residualLikelihood * r.residualSeverity;
                return (
                  <tr key={r.id} className={`border-t border-coal-100 hover:bg-coal-50 ${r.suggested ? "bg-amber-50/40" : ""}`}>
                    <td className="px-3 py-2 font-mono">
                      {r.id}
                      {r.suggested && <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-amber-200 text-amber-800 font-bold">{lang === "id" ? "AUTO" : "AUTO"}</span>}
                    </td>
                    <td className="px-3 py-2 font-semibold max-w-xs">{r.title}</td>
                    <td className="px-3 py-2">{r.category}</td>
                    <td className="px-3 py-2">{r.ownerDept}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${levelClass(inh)}`}>
                        {inh}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${levelClass(res)}`}>
                        {res}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${statusClass(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-coal-600 max-w-md">{r.treatment}</td>
                    <td className="px-3 py-2">{r.dueDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </ModulePage>
  );
}
