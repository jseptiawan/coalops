"use client";
import { ModulePage } from "@/components/ModulePage";
import { ProductionModuleView } from "@/components/ProductionModuleView";
import { useI18n } from "@/lib/i18n";

export default function Page() {
  const { lang } = useI18n();
  return (
    <ModulePage
      moduleKey="m7"
      moduleNumber={7}
      owner={lang === "id" ? "Kepala Dept. Pembersihan Lahan" : "Land Clearing Dept Head"}
      description={
        lang === "id"
          ? "Paling hulu. Area dibersihkan (Ha) harian/MTD/YTD vs rencana, topsoil dihapus & ditumpuk (m³ – saldo digunakan M13 reklamasi), pembuangan vegetasi, ketersediaan alat, keterlambatan (izin, cuaca)."
          : "Most upstream. Area cleared (Ha) daily/MTD/YTD vs plan, topsoil removed & stockpiled (m³ — balance consumed by M13 reclamation), vegetation disposal, equipment availability, delays (permits, weather)."
      }
    >
      <ProductionModuleView
        stage="landClearing"
        stageLabelKey="production.landClearing"
        moduleNumber={7}
        moduleKey="m7"
        owner=""
        description=""
      />
    </ModulePage>
  );
}
