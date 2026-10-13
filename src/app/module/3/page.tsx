"use client";
import { ModulePage } from "@/components/ModulePage";
import { ProductionModuleView } from "@/components/ProductionModuleView";
import { useI18n } from "@/lib/i18n";

export default function Page() {
  const { lang } = useI18n();
  return (
    <ModulePage
      moduleKey="m3"
      moduleNumber={3}
      owner={lang === "id" ? "Kepala Pabrik Penghancuran" : "Crushing Plant Dept Head"}
      description={
        lang === "id"
          ? "Modul opsional. Tonase dihancurkan, ketersediaan & utilisasi pabrik, ukuran produk, downtime. Toggle konfigurasi Admin."
          : "Optional module. Tonnes crushed, plant availability & utilization, product size, downtime. Admin toggle config."
      }
    >
      <ProductionModuleView
        stage="crushing"
        stageLabelKey="production.crushing"
        moduleNumber={3}
        moduleKey="m3"
        owner=""
        description=""
      />
    </ModulePage>
  );
}
