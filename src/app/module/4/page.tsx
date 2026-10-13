"use client";
import { ModulePage } from "@/components/ModulePage";
import { ProductionModuleView } from "@/components/ProductionModuleView";
import { useI18n } from "@/lib/i18n";

export default function Page() {
  const { lang } = useI18n();
  return (
    <ModulePage
      moduleKey="m4"
      moduleNumber={4}
      owner={lang === "id" ? "Kepala Operasi Tambang – Batubara" : "Mine Operation Dept Head – Coal"}
      description={
        lang === "id"
          ? "Tonase ROM digali/dimuat, ekskavator aktif, lokasi pit/seam, ringkasan kualitas batubara (dari M14), dilusi & penanganan reject, area batubara terbuka, target vs aktual."
          : "ROM tonnes excavated/loaded, active excavators, pit/seam location, coal quality summary (from M14), dilution & reject handling, exposed coal area, target vs actual."
      }
    >
      <ProductionModuleView
        stage="coalGetting"
        stageLabelKey="production.coalGetting"
        moduleNumber={4}
        moduleKey="m4"
        owner=""
        description=""
      />
    </ModulePage>
  );
}
