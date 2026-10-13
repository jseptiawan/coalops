"use client";
import { useI18n } from "@/lib/i18n";
import { FileText } from "lucide-react";

interface AuditEntry {
  id: string;
  ts: string;
  user: string;
  module: string;
  action: string;
  before: string;
  after: string;
}

const ENTRIES: AuditEntry[] = [
  { id: "AL-1042", ts: "2026-10-13 09:14", user: "Darto Suprapto", module: "M5", action: "Edit OB actual", before: "62,000 BCM", after: "63,500 BCM" },
  { id: "AL-1041", ts: "2026-10-13 08:47", user: "Andi Wijaya (Admin)", module: "Init", action: "Lock Initialization", before: "—", after: "Locked" },
  { id: "AL-1040", ts: "2026-10-13 08:12", user: "Sukarno Lim", module: "M1", action: "Barge loaded", before: "—", after: "BG-001 7,800 t" },
  { id: "AL-1039", ts: "2026-10-12 22:30", user: "Denny K. (system)", module: "M9", action: "Auto-compute MA", before: "78.0%", after: "78.0%" },
  { id: "AL-1038", ts: "2026-10-12 16:05", user: "Rika Maharani", module: "M14", action: "Mark off-spec", before: "BG-002: PASS", after: "BG-002: FAIL (CV 6,020 < 6,300)" },
  { id: "AL-1037", ts: "2026-10-12 14:22", user: "Ir. Sugeng R.", module: "M12", action: "Reconciliation submitted", before: "Draft", after: "Submitted" },
  { id: "AL-1036", ts: "2026-10-12 10:48", user: "Andi Wijaya (Admin)", module: "M16", action: "Approve late edit", before: "92.4% YTD", after: "94.1% YTD" },
  { id: "AL-1035", ts: "2026-10-11 06:00", user: "system", module: "M19", action: "Auto-generate summary", before: "—", after: "v.2026-10-11.06h" },
];

export default function AuditPage() {
  const { t, lang } = useI18n();
  return (
    <div className="space-y-3 max-w-[1400px] mx-auto">
      <header className="bg-white rounded-lg border border-coal-200 p-4">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <FileText size={18} className="text-amber-600" />
          {lang === "id" ? "Log Audit" : "Audit Log"}
        </h1>
        <p className="text-xs text-coal-500 mt-1">
          {lang === "id"
            ? "Pengguna, timestamp, nilai lama/baru. Termasuk entri inisialisasi dan penyesuaian."
            : "User, timestamp, old/new value. Includes initialization entries and adjustments."}
        </p>
      </header>

      <section className="bg-white rounded-lg border border-coal-200">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">ID</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Waktu" : "Timestamp"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Pengguna" : "User"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Modul" : "Module"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Aksi" : "Action"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Sebelum" : "Before"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Sesudah" : "After"}</th>
              </tr>
            </thead>
            <tbody>
              {ENTRIES.map((e) => (
                <tr key={e.id} className="border-t border-coal-100 hover:bg-coal-50">
                  <td className="px-3 py-2 font-mono">{e.id}</td>
                  <td className="px-3 py-2 font-mono text-coal-500">{e.ts}</td>
                  <td className="px-3 py-2 font-semibold">{e.user}</td>
                  <td className="px-3 py-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-mono">{e.module}</span></td>
                  <td className="px-3 py-2">{e.action}</td>
                  <td className="px-3 py-2 text-coal-500 line-through opacity-70">{e.before}</td>
                  <td className="px-3 py-2 font-semibold text-emerald-700">{e.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
