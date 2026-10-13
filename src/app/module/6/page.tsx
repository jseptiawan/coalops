"use client";
import { ModulePage } from "@/components/ModulePage";
import { ProductionModuleView } from "@/components/ProductionModuleView";
import { useI18n } from "@/lib/i18n";

export default function Page() {
  const { lang } = useI18n();
  return (
    <ModulePage
      moduleKey="m6"
      moduleNumber={6}
      owner={lang === "id" ? "Kepala Dept. Pengeboran & Peledakan" : "D&B Dept Head"}
      description={
        lang === "id"
          ? "Pengeboran: meter dibor, lubang, rig aktif & ketersediaan. Peledakan: ledakan dilakukan, BCM/ton diledakkan, konsumsi bahan peledak (ANFO/emulsi kg, detonator), powder factor, misfire, flyrock/getaran, kepatuhan peledakan terhadap rencana, status blok (drilled/charged/fired)."
          : "Drilling: meters drilled, holes, rigs active & availability. Blasting: blasts conducted, BCM/tonnes blasted, explosive consumption (ANFO/emulsion kg, detonators), powder factor, misfires, flyrock/vibration, blast compliance to plan, block status (drilled/charged/fired)."
      }
    >
      <ProductionModuleView
        stage="drillingBlasting"
        stageLabelKey="production.drillingBlasting"
        moduleNumber={6}
        moduleKey="m6"
        owner=""
        description=""
      />
    </ModulePage>
  );
}
