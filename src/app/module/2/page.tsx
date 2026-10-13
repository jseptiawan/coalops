"use client";
import { ModulePage } from "@/components/ModulePage";
import { ProductionModuleView } from "@/components/ProductionModuleView";
import { useI18n } from "@/lib/i18n";

export default function Page() {
  const { lang } = useI18n();
  return (
    <ModulePage
      moduleKey="m2"
      moduleNumber={2}
      owner={lang === "id" ? "Kepala Dept. Pengangkutan Batubara" : "Coal Hauling Dept Head"}
      description={
        lang === "id"
          ? "Tonase diangkut dari pit ke ROM/pelabuhan, trip, truk aktif, rata-rata muatan, waktu siklus, jarak, konsumsi BBM, downtime, target vs aktual."
          : "Tonnes hauled from pit to ROM/port, trips, active trucks, average payload, cycle time, distance, fuel consumption, downtime, target vs actual."
      }
    >
      <ProductionModuleView
        stage="coalHauling"
        stageLabelKey="production.coalHauling"
        moduleNumber={2}
        moduleKey="m2"
        owner=""
        description=""
        extraFields={[
          { key: "trips", label: "Trips", value: "342" },
          { key: "trucks", label: "Trucks Active", value: "14" },
          { key: "payload", label: "Avg Payload (t)", value: "92" },
        ]}
      />
    </ModulePage>
  );
}
