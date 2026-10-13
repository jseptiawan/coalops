"use client";
import { ModulePage } from "@/components/ModulePage";
import { useI18n } from "@/lib/i18n";
import { contracts, royaltyRows, shipments } from "@/lib/seed";
import { fmtNum, fmtPct, fmtUSD } from "@/lib/aggregations";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { Briefcase, TrendingUp, FileText } from "lucide-react";

export default function Page() {
  const { t, lang } = useI18n();
  const totalDeliveredLTD = contracts.reduce((a, c) => a + c.deliveredLTD, 0);
  const totalAQ = contracts.reduce((a, c) => a + c.annualQty, 0);
  const dmoMTD = contracts.filter((c) => c.dmo).reduce((a, c) => a + c.deliveredMTD, 0);
  const exportMTD = contracts.filter((c) => !c.dmo).reduce((a, c) => a + c.deliveredMTD, 0);

  const sCurve = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    return {
      month: `M${m}`,
      plan: Math.round((totalAQ / 12) * m),
      actual: m <= 10 ? Math.round((totalAQ / 12) * m * (0.85 + (m % 3) * 0.05)) : null,
    };
  });

  return (
    <ModulePage
      moduleKey="m15"
      moduleNumber={15}
      owner={lang === "id" ? "Kepala Dept. Penjualan & Pemasaran" : "Sales & Marketing Dept Head"}
      description={
        lang === "id"
          ? "Kontrak master, realisasi penjualan per kontrak, kepatuhan kontrak, DMO (default 25%), royalti (IUP 3.5%–7%, IUPK 13.5%, semua admin-configurable), harga referensi bulanan (HBA/HPB/ICI). Notifikasi: shortfall nominasi, shortfall DMO, paparan laycan/demurrage, batas pembayaran royalti."
          : "Contract master, sales realization per contract, contract compliance, DMO (default 25%), royalty (IUP 3.5%–7%, IUPK 13.5%, all admin-configurable), monthly reference prices (HBA/HPB/ICI). Notifications: nomination shortfall, DMO shortfall, laycan/demurrage exposure, royalty payment deadline."
      }
    >
      <div className="grid md:grid-cols-4 gap-2">
        <KPI label="LTD {lang === 'id' ? 'Terkirim' : 'Delivered'}" value={fmtNum(totalDeliveredLTD)} unit="t" />
        <KPI label="AQ {lang === 'id' ? 'Total' : 'Total'}" value={fmtNum(totalAQ)} unit="t/year" />
        <KPI label="DMO {lang === 'id' ? 'Kepatuhan' : 'Compliance'}" value="92%" tone="warning" />
        <KPI label={lang === "id" ? "Royalti bulan lalu" : "Royalty last month"} value="IDR 12.0B" tone="good" />
      </div>

      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <TrendingUp size={14} className="text-amber-600" />
          {lang === "id" ? "Kontrak S-Curve (tahun ini)" : "Contract S-Curve (this year)"}
        </h3>
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={sCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} unit="t" />
              <Tooltip />
              <Line type="monotone" dataKey="plan" stroke="#0f172a" strokeWidth={2} dot={false} name="Plan" />
              <Line type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={2} dot={{ fill: "#16a34a" }} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-coal-200">
        <header className="px-4 py-3 border-b border-coal-200">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Briefcase size={14} className="text-amber-600" />
            {lang === "id" ? "Kontrak & Realisasi" : "Contracts & Realization"}
          </h2>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Kontrak" : "Contract"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Pelanggan" : "Customer"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Tipe" : "Type"}</th>
                <th className="px-3 py-2 text-right font-semibold">AQ</th>
                <th className="px-3 py-2 text-right font-semibold">MTD</th>
                <th className="px-3 py-2 text-right font-semibold">YTD</th>
                <th className="px-3 py-2 text-right font-semibold">LTD</th>
                <th className="px-3 py-2 text-right font-semibold">YTD %</th>
                <th className="px-3 py-2 text-right font-semibold">Price (USD)</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => {
                const ytdPct = (c.deliveredYTD / (c.annualQty * 10 / 12)) * 100;
                return (
                  <tr key={c.id} className="border-t border-coal-100 hover:bg-coal-50">
                    <td className="px-3 py-2 font-mono">{c.id}</td>
                    <td className="px-3 py-2 font-semibold">
                      {c.customer}
                      {c.dmo && (
                        <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">DMO</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{c.type}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtNum(c.annualQty)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtNum(c.deliveredMTD)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtNum(c.deliveredYTD)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtNum(c.deliveredLTD)}</td>
                    <td className={`px-3 py-2 text-right tabular-nums font-semibold ${
                      ytdPct >= 95 ? "text-emerald-700" : ytdPct >= 80 ? "text-amber-700" : "text-red-700"
                    }`}>{fmtPct(ytdPct, 0)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">${c.basePrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-coal-200 p-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2">
          <FileText size={14} className="text-amber-600" />
          {lang === "id" ? "Royalti – IUP 5%" : "Royalty – IUP 5%"} (HBA/HPB {lang === "id" ? "bulan ini" : "this month"}: 87.5 USD/t)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-coal-100 text-coal-600">
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Periode" : "Period"}</th>
                <th className="px-3 py-2 text-left font-semibold">{lang === "id" ? "Kontrak" : "Contract"}</th>
                <th className="px-3 py-2 text-right font-semibold">{lang === "id" ? "Volume (t)" : "Volume (t)"}</th>
                <th className="px-3 py-2 text-right font-semibold">Harga Acuan</th>
                <th className="px-3 py-2 text-right font-semibold">Harga Realisasi</th>
                <th className="px-3 py-2 text-right font-semibold">Dasar Royalti</th>
                <th className="px-3 py-2 text-right font-semibold">%</th>
                <th className="px-3 py-2 text-right font-semibold">Royalti (IDR)</th>
                <th className="px-3 py-2 text-left font-semibold">{t("common.status")}</th>
              </tr>
            </thead>
            <tbody>
              {royaltyRows.map((r, i) => (
                <tr key={i} className="border-t border-coal-100">
                  <td className="px-3 py-2 font-mono">{r.period}</td>
                  <td className="px-3 py-2">{r.contract}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtNum(r.volumeTonnes)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">${r.benchmarkPrice}</td>
                  <td className="px-3 py-2 text-right tabular-nums">${r.realizedPrice}</td>
                  <td className="px-3 py-2 text-right tabular-nums">${r.royaltyBase}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.ratePct}%</td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold">{(r.royaltyIDR / 1_000_000_000).toFixed(2)}B</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      r.paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {r.paid ? (lang === "id" ? "LUNAS" : "PAID") : (lang === "id" ? "BELUM" : "DUE")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-3">
        <section className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <h3 className="text-sm font-bold text-emerald-800">DMO {lang === "id" ? "Pemenuhan" : "Compliance"}</h3>
          <div className="text-2xl font-bold mt-1">92%</div>
          <div className="text-[11px] text-emerald-700 mt-1">
            {lang === "id" ? "Target 25% dari produksi" : "Target 25% of production"} · Realisasi MTD: {fmtNum(dmoMTD)} t {lang === "id" ? "dari" : "of"} {fmtNum(exportMTD + dmoMTD)} t {lang === "id" ? "total" : "total"}
          </div>
          <div className="h-2 bg-emerald-100 rounded mt-2">
            <div className="h-2 bg-emerald-500 rounded" style={{ width: "92%" }} />
          </div>
        </section>
        <section className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h3 className="text-sm font-bold text-amber-800">{lang === "id" ? "Pembayaran Royalti Berikutnya" : "Next Royalty Payment"}</h3>
          <div className="text-2xl font-bold mt-1">10 Nov 2026</div>
          <div className="text-[11px] text-amber-700 mt-1">
            {lang === "id" ? "Estimasi" : "Est."} IDR 5.12 Bn (3 kontrak · 72,000 t)
          </div>
        </section>
      </div>
    </ModulePage>
  );
}

function KPI({ label, value, unit, tone }: { label: string; value: string; unit?: string; tone?: "good" | "warning" | "bad" | "default" }) {
  const cls = tone === "good" ? "border-emerald-200 bg-emerald-50/50" : tone === "warning" ? "border-amber-200 bg-amber-50/50" : tone === "bad" ? "border-red-200 bg-red-50/50" : "border-coal-200 bg-coal-50/50";
  const valCls = tone === "good" ? "text-emerald-700" : tone === "warning" ? "text-amber-700" : tone === "bad" ? "text-red-700" : "text-coal-900";
  return (
    <div className={`rounded border ${cls} p-2.5`}>
      <div className="text-[10px] text-coal-500 uppercase tracking-wider">{label}</div>
      <div className={`text-xl font-bold mt-0.5 ${valCls}`}>
        {value} {unit && <span className="text-[10px] text-coal-500 font-normal">{unit}</span>}
      </div>
    </div>
  );
}
