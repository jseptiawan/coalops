"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { employees } from "@/lib/seed";
import { Users, Award, AlertCircle } from "lucide-react";

const today = new Date("2026-10-13T00:00:00+07:00");

export default function Page() {
  const { t, lang } = useI18n();

  const total = employees.length;
  const byDept = employees.reduce<Record<string, number>>((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});
  const expiring = employees.filter((e) => {
    const exp = e.simperExpiry || e.certExpiry;
    if (!exp) return false;
    const days = (new Date(exp).getTime() - today.getTime()) / 86400000;
    return days <= 30 && days > -30;
  });
  const expired = employees.filter((e) => {
    if (!e.simperExpiry) return false;
    return new Date(e.simperExpiry) <= today;
  });

  return (
    <ModulePage
      moduleKey="m11"
      moduleNumber={11}
      owner={lang === "id" ? "Kepala Dept. SDM" : "HR Dept Head"}
      description={
        lang === "id"
          ? "Master karyawan: NIK, nama, posisi, departemen, tipe pekerjaan, kewarganegaraan, pendidikan, tanggal gabung, kadaluarsa kontrak, grup roster. Absensi harian per departemen. Dasbor headcount, turnover, rasio lokal:expat. Matriks sertifikasi: SIMPER, POP/POM, K3, P3K, lainnya — tanggal kadaluarsa, peringatan 90/60/30 hari. Catatan pelatihan."
          : "Employee master: NIK, name, position, department, employment type, nationality, education, join date, contract expiry, roster group. Daily attendance per department. Headcount dashboard, turnover, local:expat ratio. Certification matrix: SIMPER, POP/POM, K3, First Aid — expiry dates, 90/60/30-day warnings. Training records."
      }
    >
      <div className="grid md:grid-cols-4 gap-2">
        <KPI label={lang === "id" ? "Total karyawan" : "Total employees"} value={`${total * 36}+`} suffix={lang === "id" ? "demo: 15 ditampilkan" : "demo: 15 shown"} />
        <KPI label={lang === "id" ? "Hadir hari ini" : "Present today"} value="95.8%" tone="good" />
        <KPI label={lang === "id" ? "Sertif ≤30 hari" : "Certs expiring ≤30d"} value={expiring.length.toString()} tone={expiring.length > 0 ? "bad" : "default"} />
        <KPI label={lang === "id" ? "SIMPER kedaluwarsa" : "Expired SIMPER"} value={expired.length.toString()} tone={expired.length > 0 ? "bad" : "good"} />
      </div>

      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <Users size={14} className="text-amber-600" />
          {lang === "id" ? "Headcount per Departemen" : "Headcount by Department"} ({lang === "id" ? "sampel demo" : "demo sample"})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.entries(byDept).map(([d, c]) => (
            <div key={d} className="rounded border border-coal-200 bg-coal-50/30 p-2">
              <div className="text-[10px] text-coal-500 uppercase truncate">{d}</div>
              <div className="text-lg font-bold">{c}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Award size={14} className="text-amber-600" />
            {lang === "id" ? "Matriks Sertifikasi & SIMPER" : "Certification & SIMPER Matrix"}
          </h2>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">NIK</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Nama" : "Name"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Departemen" : "Department"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Posisi" : "Position"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Tipe" : "Type"}</th>
                <th className="px-3 py-2 text-left font-semibold">SIMPER</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Sertifikat" : "Cert"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Kontrak" : "Contract"}</th>
                <th className="px-3 py-2 text-center font-semibold">{lang === "id" ? "Status" : "Status"}</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => {
                const expCert = e.certExpiry ? daysUntil(e.certExpiry) : null;
                const expSimper = e.simperExpiry ? daysUntil(e.simperExpiry) : null;
                const tone = (d: number | null) => {
                  if (d === null) return "";
                  if (d < 0) return "text-red-600 font-bold";
                  if (d <= 30) return "text-amber-600 font-semibold";
                  return "text-coal-700";
                };
                return (
                  <tr key={e.id} className="border-t border-coal-100 hover:bg-coal-50">
                    <td className="px-3 py-2 font-mono">{e.nik}</td>
                    <td className="px-3 py-2 font-semibold">{e.name}</td>
                    <td className="px-3 py-2">{e.department}</td>
                    <td className="px-3 py-2">{e.position}</td>
                    <td className="px-3 py-2">{e.type}</td>
                    <td className={`px-3 py-2 ${tone(expSimper)}`}>
                      {e.simperExpiry ? `${e.simperExpiry} (${expSimper}d)` : "—"}
                    </td>
                    <td className={`px-3 py-2 ${tone(expCert)}`}>
                      {e.certExpiry ? `${e.certExpiry} (${expCert}d)` : "—"}
                    </td>
                    <td className="px-3 py-2">{e.contractExpiry || "—"}</td>
                    <td className="px-3 py-2 text-center">
                      {(expSimper !== null && expSimper < 0) || (expCert !== null && expCert < 0) ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold flex items-center gap-1 inline-flex">
                          <AlertCircle size={10} /> {lang === "id" ? "EXPIRED" : "EXPIRED"}
                        </span>
                      ) : (expSimper !== null && expSimper <= 30) || (expCert !== null && expCert <= 30) ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold">
                          {lang === "id" ? "SEGERA" : "SOON"}
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">
                          OK
                        </span>
                      )}
                    </td>
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

function daysUntil(dateStr: string): number {
  return Math.floor((new Date(dateStr).getTime() - today.getTime()) / 86400000);
}

function KPI({ label, value, suffix, tone }: { label: string; value: string; suffix?: string; tone?: "good" | "bad" | "default" }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-coal-50/50";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${cls} p-2.5`}>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${valCls}`}>{value}</div>
      {suffix && <div className="text-[10px] text-coal-500 mt-0.5">{suffix}</div>}
    </div>
  );
}
