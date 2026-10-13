"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { executiveSummary } from "@/lib/seed";
import { fmtNum, fmtPct } from "@/lib/aggregations";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine, ComposedChart, Line } from "recharts";
import { Banknote, Boxes, ArrowRight, TrendingUp } from "lucide-react";

export default function Page() {
  const { t, lang } = useI18n();
  const massBalance = [
    { node: "ROM Pad", in: 198, out: 188, balance: 14 },
    { node: "Stockpile SP-01", in: 188, out: 80, balance: 108 },
    { node: "Stockpile SP-02", in: 0, out: 78, balance: 30 },
    { node: "Barge Loading", in: 158, out: 158, balance: 0 },
  ];

  return (
    <ModulePage
      moduleKey="m17"
      moduleNumber={17}
      owner={lang === "id" ? "Kepala Dept. Keuangan & Akuntansi (input volume oleh Engineering, kualitas oleh QA/QC, harga oleh Sales; GM menyetujui)" : "Finance & Accounting Dept Head (volumes verified by Engineering, quality by QA/QC, prices by Sales; GM approves)"}
      description={
        lang === "id"
          ? "Pernyataan bulanan tunggal menggabungkan TONASE + KUALITAS + NILAI di seluruh rantai: pit → angkut → stockpile → tongkang → kapal transshipment. Neraca massa per lokasi. Neraca kualitas. Neraca nilai. Waterfall nilai. Diagram alir pit-to-port. KPI inventori. Alur penutupan bulanan: Draf (Finance) → Verifikasi oleh Engineering & QA/QC → Persetujuan GM → Terkunci."
          : "Single monthly statement combining TONNAGE + QUALITY + VALUE across the full chain: pit → haulage → stockpile → barge → transshipment vessel. Mass balance ledger per location. Quality balance. Value balance. Value waterfall. Pit-to-port flow diagram. Inventory KPIs. Monthly closing workflow: Draft (Finance) → Verification by Engineering & QA/QC → GM Approval → Locked."
      }
    >
      <div className="grid md:grid-cols-4 gap-2">
        <KPI label={lang === "id" ? "Stok akhir" : "Closing stock"} value="142,000 t" />
        <KPI label={lang === "id" ? "Varians massa" : "Mass variance"} value="+1.2%" tone="good" />
        <KPI label={lang === "id" ? "Nilai inventori" : "Inventory value"} value="Rp 178B" />
        <KPI label={lang === "id" ? "Hari pengiriman" : "Days cover"} value={lang === "id" ? "6.8 hari" : "6.8 days"} />
      </div>

      {/* Mass balance */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <Boxes size={14} className="text-amber-600" />
          {lang === "id" ? "Neraca Massa Bulanan (000 t)" : "Monthly Mass Balance (000 t)"}
        </h3>
        <div className="h-56">
          <ResponsiveContainer>
            <ComposedChart data={massBalance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="node" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="in" fill="#16a34a" name={lang === "id" ? "Masuk" : "In"} />
              <Bar dataKey="out" fill="#dc2626" name={lang === "id" ? "Keluar" : "Out"} />
              <Line type="monotone" dataKey="balance" stroke="#0f172a" strokeWidth={2} name={lang === "id" ? "Saldo" : "Balance"} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Pit-to-port flow */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <ArrowRight size={14} className="text-amber-600" />
          {lang === "id" ? "Aliran Pit-to-Port" : "Pit-to-Port Flow"}
        </h3>
        <FlowDiagram />
      </section>

      {/* Value waterfall */}
      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <Banknote size={14} className="text-amber-600" />
          {lang === "id" ? "Waterfall Nilai (USD/t, MtD)" : "Value Waterfall (USD/t, MTD)"}
        </h3>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={[
              { step: "Acuan (HBA)", val: 87.5 },
              { step: "CV adj", val: -1.2 },
              { step: "Ash penalty", val: -0.8 },
              { step: "TM penalty", val: -0.3 },
              { step: "Price realized", val: 85.2 },
              { step: "DMO cap", val: -8.5 },
              { step: "Net", val: 76.7 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="step" fontSize={10} />
              <YAxis fontSize={10} unit="$" />
              <Tooltip />
              <ReferenceLine y={0} stroke="#0f172a" />
              <Bar dataKey="val" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="bg-coal-50 border border-coal-200 rounded-lg p-3 text-xs flex items-center justify-between">
        <div>
          <div className="font-semibold text-coal-700">
            {lang === "id" ? "Alur Penutupan Bulanan" : "Monthly Closing Workflow"}
          </div>
          <div className="text-coal-500 mt-0.5">
            Draft (Finance) → Verifikasi (Engineering, QA/QC) → Persetujuan GM → Terkunci
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Sept: CLOSED</span>
          <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">Oct: DRAFT</span>
        </div>
      </div>
    </ModulePage>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone?: "good" | "warning" | "bad" | "default" }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "warning" ? "border-amber-200 bg-amber-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-coal-50/50";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "warning" ? "text-amber-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${cls} p-2.5`}>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${valCls}`}>{value}</div>
    </div>
  );
}

function FlowDiagram() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {[
        { label: "Pit A", sub: "ROM 198 kt", tone: "stone" },
        { label: "Crusher", sub: "—", tone: "slate" },
        { label: "Stockpile SP-01", sub: "Stock 108 kt", tone: "amber" },
        { label: "Stockpile SP-02", sub: "Stock 30 kt", tone: "amber" },
        { label: "Barge Loading", sub: "158 kt", tone: "blue" },
        { label: "Vessel", sub: "transshipment", tone: "emerald" },
      ].map((n, i, arr) => (
        <div key={n.label} className="flex items-center">
          <div className={`rounded-lg border-2 px-3 py-2 text-center min-w-[110px] ${
            n.tone === "stone" ? "border-coal-300 bg-coal-50" :
            n.tone === "slate" ? "border-slate-300 bg-slate-50" :
            n.tone === "amber" ? "border-amber-300 bg-amber-50" :
            n.tone === "blue" ? "border-blue-300 bg-blue-50" :
            "border-emerald-300 bg-emerald-50"
          }`}>
            <div className="text-[10px] uppercase text-coal-500">{n.label}</div>
            <div className="text-sm font-bold">{n.sub}</div>
          </div>
          {i < arr.length - 1 && <ArrowRight size={16} className="mx-1 text-coal-400" />}
        </div>
      ))}
    </div>
  );
}
