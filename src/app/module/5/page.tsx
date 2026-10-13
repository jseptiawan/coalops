"use client";
import { ModulePage } from "@/components/ModulePage";
import { ProductionModuleView } from "@/components/ProductionModuleView";
import { useI18n } from "@/lib/i18n";

export default function Page() {
  const { lang } = useI18n();
  return (
    <ModulePage
      moduleKey="m5"
      moduleNumber={5}
      owner={lang === "id" ? "Kepala Operasi Tambang – Waste" : "Mine Operation Dept Head – Waste"}
      description={
        lang === "id"
          ? "BCM dipindahkan, rasio pengupasan (aktual vs rencana), ekskavator & truk diterapkan, ringkasan ketersediaan alat (dari M9), kesiapan material yang diledakkan (M6), progress paparan batubara, target vs aktual."
          : "BCM moved, stripping ratio (actual vs plan), excavators & trucks deployed, equipment availability summary (from M9), blasted material readiness (M6), coal exposure progress, target vs actual."
      }
    >
      <ProductionModuleView
        stage="obRemoval"
        stageLabelKey="production.obRemoval"
        moduleNumber={5}
        moduleKey="m5"
        owner=""
        description=""
      />
    </ModulePage>
  );
}
