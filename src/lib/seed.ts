import type {
  SafetyKPI,
  ProductionActual,
  Equipment,
  SafetyIssue,
  WorkOrder,
  Employee,
  Risk,
  Contract,
  BudgetLine,
  RoyaltyRow,
  Reconciliation,
  EnvRecord,
  QualitySample,
  Shipment,
  ExecutiveSummary,
} from "./types";

// Onboarding cutoff: 4 weeks ago. After that, 4 weeks of daily data.
const today = new Date("2026-10-13T00:00:00+07:00");
const cutoff = new Date(today);
cutoff.setDate(cutoff.getDate() - 28);
const onboardingCutoff = cutoff.toISOString().slice(0, 10);
const mineStart = new Date(today);
mineStart.setFullYear(mineStart.getFullYear() - 6);
const mineStartDate = mineStart.toISOString().slice(0, 10);

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dateOffset(days: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return ymd(d);
}

// ───────────────────────────────────────────────────────────────
// ONBOARDING / OPENING BALANCES (mid-life mine)
// ───────────────────────────────────────────────────────────────
export const initInfo = {
  scenario: "mid-life" as const,
  mineStart: mineStartDate,
  onboardingCutoff,
  currency: "IDR" as const,
  locked: true,
  message:
    "Mid-life onboarding: system entries start after the cutoff date. All figures before the cutoff are opening balances (LTD baseline).",
};

// ───────────────────────────────────────────────────────────────
// SAFETY (Module 0)
// ───────────────────────────────────────────────────────────────
export const safetyKPI: SafetyKPI = {
  manHoursMTD: 184_220,
  manHoursYTD: 1_812_640,
  manHoursLTD: 9_876_000,
  daysWithoutLTI: 312,
  daysWithoutFatality: 1240,
  ltifr: 0.12,
  trifr: 0.41,
  counts: {
    fatality: 0,
    lti: 0,
    mtc: 1,
    rwc: 0,
    fac: 2,
    firstAid: 5,
    nearMiss: 3,
    pdu: 1,
  },
  ppeCompliancePct: 98.4,
  tbtHeld: 18,
  inspectionsOpen: 4,
  inspectionsClosed: 26,
  permitsActive: 12,
  openIssues: 6,
  highRiskOpen: 1,
};

export const safetyIssues: SafetyIssue[] = [
  {
    id: "SI-2026-091",
    date: dateOffset(-2),
    description: "Slip hazard on ramp haul road KM 4.2 after rainfall",
    category: "Slip/Trip/Fall",
    location: "Pit A – Haul Road 4.2",
    riskLevel: "High",
    pic: "HSE Supervisor",
    dueDate: dateOffset(2),
    status: "InProgress",
  },
  {
    id: "SI-2026-090",
    date: dateOffset(-4),
    description: "Dust suppression not effective at ROM transfer point",
    category: "Dust",
    location: "ROM Pad 1",
    riskLevel: "Medium",
    pic: "Env Officer",
    dueDate: dateOffset(5),
    status: "Open",
  },
  {
    id: "SI-2026-089",
    date: dateOffset(-7),
    description: "Damaged handrail on conveyor CV-03 walkway",
    category: "Equipment",
    location: "Crusher Plant",
    riskLevel: "Medium",
    pic: "Maintenance Planner",
    dueDate: dateOffset(-1),
    status: "InProgress",
  },
  {
    id: "SI-2026-088",
    date: dateOffset(-12),
    description: "Worker not wearing chinstrap on helmet",
    category: "PPE",
    location: "Pit B Workshop",
    riskLevel: "Low",
    pic: "Foreman",
    dueDate: dateOffset(-8),
    status: "Closed",
  },
  {
    id: "SI-2026-087",
    date: dateOffset(-15),
    description: "Improper stacking of gas cylinders near welding area",
    category: "Fire/Explosion",
    location: "Workshop Bay 2",
    riskLevel: "Medium",
    pic: "Workshop Lead",
    dueDate: dateOffset(-10),
    status: "Closed",
  },
  {
    id: "SI-2026-086",
    date: dateOffset(-20),
    description: "Operator fatigue noted on shift 2 haul truck fleet",
    category: "Behavioral",
    location: "Haul Fleet",
    riskLevel: "Medium",
    pic: "HR & HSE",
    dueDate: dateOffset(-5),
    status: "Closed",
  },
];

// ───────────────────────────────────────────────────────────────
// PRODUCTION CHAIN (Modules 1–7) — daily series
// ───────────────────────────────────────────────────────────────

const stages: ProductionActual["stage"][] = [
  "loadToBarge",
  "coalHauling",
  "coalGetting",
  "obRemoval",
  "drillingBlasting",
  "landClearing",
];

// Generate 28 days of production data with deliberate underperformers
function genProduction(): ProductionActual[] {
  const rows: ProductionActual[] = [];
  const basePlan: Record<ProductionActual["stage"], number> = {
    loadToBarge: 8000, // tonnes/day
    coalHauling: 8500,
    crushing: 0, // optional
    coalGetting: 8200,
    obRemoval: 32000, // BCM
    drillingBlasting: 1500, // meters
    landClearing: 1.5, // Ha
  };
  for (let i = 0; i < 28; i++) {
    const d = dateOffset(-i - 1);
    for (const stage of stages) {
      // Underperform on hauling on 2 days, on OB for 3 days, on drilling 1 day
      let factor = 0.95 + Math.sin(i * 0.4) * 0.04; // ~95-99% normally
      if (stage === "coalHauling" && (i === 1 || i === 4)) factor = 0.7;
      if (stage === "obRemoval" && (i === 2 || i === 3 || i === 5)) factor = 0.65;
      if (stage === "drillingBlasting" && i === 0) factor = 0.55;
      if (stage === "loadToBarge" && i === 1) factor = 0.78;
      const planTonnes = basePlan[stage];
      const planBCM = stage === "obRemoval" ? planTonnes : undefined;
      const actualTonnes = Math.round(planTonnes * factor);
      const actualBCM = planBCM ? Math.round(planBCM * factor) : undefined;
      rows.push({
        stage,
        date: d,
        shift: 1,
        location: stage === "loadToBarge" ? "Jetty 1" : "Pit A",
        planTonnes,
        actualTonnes,
        planBCM,
        actualBCM,
        remarks:
          factor < 0.85 ? "Heavy rain, equipment breakdown" : "Normal operation",
        cause: factor < 0.85 ? "Weather+Equipment" : undefined,
        equipmentIds: [],
      });
    }
  }
  return rows;
}

export const productionActuals: ProductionActual[] = genProduction();

// ───────────────────────────────────────────────────────────────
// EQUIPMENT (Module 8)
// ───────────────────────────────────────────────────────────────
export const equipment: Equipment[] = [
  { id: "EX-101", code: "EX-101", class: "Excavator", make: "Caterpillar", model: "390F", capacity: "5.0 m³", status: "Operating", site: "Pit A", hmTotal: 18420, utilizationPct: 92, assignedOperator: "OP-2031", operatorSIMPERExpiry: dateOffset(45) },
  { id: "EX-102", code: "EX-102", class: "Excavator", make: "Komatsu", model: "PC850", capacity: "4.5 m³", status: "Breakdown", site: "Pit A", hmTotal: 21200, utilizationPct: 71, assignedOperator: "OP-2017", operatorSIMPERExpiry: dateOffset(20) },
  { id: "EX-103", code: "EX-103", class: "Excavator", make: "Hitachi", model: "EX1900", capacity: "10 m³", status: "UnderPM", site: "Pit B", hmTotal: 14750, utilizationPct: 84 },
  { id: "DT-201", code: "DT-201", class: "DumpTruck", make: "Caterpillar", model: "777G", capacity: "100 t", status: "Operating", site: "Pit A", hmTotal: 32100, utilizationPct: 89 },
  { id: "DT-202", code: "DT-202", class: "DumpTruck", make: "Caterpillar", model: "777G", capacity: "100 t", status: "Operating", site: "Pit A", hmTotal: 30500, utilizationPct: 86 },
  { id: "DT-203", code: "DT-203", class: "DumpTruck", make: "Komatsu", model: "HD785", capacity: "91 t", status: "Standby", site: "Pit A", hmTotal: 28100, utilizationPct: 73 },
  { id: "DT-204", code: "DT-204", class: "DumpTruck", make: "Komatsu", model: "HD785", capacity: "91 t", status: "Breakdown", site: "Pit B", hmTotal: 33200, utilizationPct: 64, assignedOperator: "OP-2044", operatorSIMPERExpiry: dateOffset(-2) },
  { id: "DT-205", code: "DT-205", class: "DumpTruck", make: "Belaz", model: "7547", capacity: "120 t", status: "Operating", site: "Pit B", hmTotal: 26100, utilizationPct: 88 },
  { id: "DR-301", code: "DR-301", class: "DrillRig", make: "Atlas Copco", model: "Pit Viper 351", capacity: "12-21 m", status: "Operating", site: "Pit A", hmTotal: 14500, utilizationPct: 78 },
  { id: "DR-302", code: "DR-302", class: "DrillRig", make: "Sandvik", model: "D65", capacity: "10-30 m", status: "Operating", site: "Pit A", hmTotal: 11900, utilizationPct: 82 },
  { id: "DR-303", code: "DR-303", class: "DrillRig", make: "Atlas Copco", model: "SmartROC D65", capacity: "9-30 m", status: "Standby", site: "Pit B", hmTotal: 9400, utilizationPct: 65 },
  { id: "DZ-401", code: "DZ-401", class: "Dozer", make: "Caterpillar", model: "D8T", capacity: "n/a", status: "Operating", site: "Pit A", hmTotal: 22300, utilizationPct: 90 },
  { id: "DZ-402", code: "DZ-402", class: "Dozer", make: "Komatsu", model: "D155", capacity: "n/a", status: "Operating", site: "Pit B", hmTotal: 19800, utilizationPct: 87 },
  { id: "LD-501", code: "LD-501", class: "Loader", make: "Caterpillar", model: "994K", capacity: "20 t", status: "Operating", site: "ROM 1", hmTotal: 24100, utilizationPct: 88 },
  { id: "LD-502", code: "LD-502", class: "Loader", make: "Caterpillar", model: "988K", capacity: "10 t", status: "Operating", site: "Stockpile", hmTotal: 21500, utilizationPct: 84 },
  { id: "BG-001", code: "BG-001", class: "Barge", make: "Adaro", model: "300ft", capacity: "8000 t", status: "Operating", site: "Jetty 1", hmTotal: 0, utilizationPct: 95 },
  { id: "BG-002", code: "BG-002", class: "Barge", make: "Adaro", model: "300ft", capacity: "8000 t", status: "Standby", site: "Jetty 1", hmTotal: 0, utilizationPct: 78 },
  { id: "BG-003", code: "BG-003", class: "Barge", make: "Adaro", model: "300ft", capacity: "8000 t", status: "Operating", site: "Jetty 1", hmTotal: 0, utilizationPct: 92 },
  { id: "GR-601", code: "GR-601", class: "Grader", make: "Caterpillar", model: "16M", capacity: "n/a", status: "Operating", site: "Pit A", hmTotal: 16700, utilizationPct: 80 },
  { id: "CR-701", code: "CR-701", class: "Crane", make: "Liebherr", model: "LTM 1090", capacity: "90 t", status: "Available", site: "Workshop", hmTotal: 9100, utilizationPct: 40 },
];

// ───────────────────────────────────────────────────────────────
// MAINTENANCE (Modules 9, 10)
// ───────────────────────────────────────────────────────────────
export const workOrders: WorkOrder[] = [
  { id: "WO-2026-1042", unit: "DT-204", type: "Breakdown", description: "Engine overheating, coolant leak", priority: "Critical", status: "InProgress", openDate: dateOffset(-2), dueDate: dateOffset(1), downtimeHours: 36, costIDR: 145_000_000 },
  { id: "WO-2026-1041", unit: "EX-102", type: "Breakdown", description: "Hydraulic pump failure", priority: "High", status: "InProgress", openDate: dateOffset(-3), dueDate: dateOffset(2), downtimeHours: 48, costIDR: 320_000_000 },
  { id: "WO-2026-1040", unit: "EX-103", type: "PM-1000", description: "1000H PM service", priority: "Medium", status: "InProgress", openDate: dateOffset(-1), dueDate: dateOffset(3), downtimeHours: 18, costIDR: 78_000_000 },
  { id: "WO-2026-1039", unit: "DT-201", type: "PM-500", description: "500H PM service", priority: "Medium", status: "Scheduled", openDate: dateOffset(-2), dueDate: dateOffset(4), downtimeHours: 0, costIDR: 0 },
  { id: "WO-2026-1038", unit: "DR-302", type: "PM-250", description: "250H PM service", priority: "Low", status: "Approved", openDate: dateOffset(-1), dueDate: dateOffset(6), downtimeHours: 0, costIDR: 0 },
  { id: "WO-2026-1037", unit: "DZ-401", type: "Modification", description: "Track tension adjustment", priority: "Low", status: "Completed", openDate: dateOffset(-5), dueDate: dateOffset(-3), downtimeHours: 6, costIDR: 8_500_000 },
  { id: "WO-2026-1036", unit: "LD-502", type: "Predictive", description: "Oil analysis follow-up, replace hydraulic filter", priority: "Medium", status: "Verified", openDate: dateOffset(-8), dueDate: dateOffset(-2), downtimeHours: 4, costIDR: 12_000_000 },
  { id: "WO-2026-1035", unit: "BG-002", type: "Modification", description: "Cargo hold hatch seal replacement", priority: "Medium", status: "InProgress", openDate: dateOffset(-6), dueDate: dateOffset(2), downtimeHours: 72, costIDR: 95_000_000 },
];

// ───────────────────────────────────────────────────────────────
// HR (Module 11)
// ───────────────────────────────────────────────────────────────
export const employees: Employee[] = [
  { id: "EMP-0001", nik: "1001234", name: "Budi Santoso", department: "Mine Operation", position: "Foreman", type: "Permanent", joinDate: "2019-03-12", simperExpiry: dateOffset(120), certExpiry: dateOffset(220) },
  { id: "EMP-0002", nik: "1001235", name: "Siti Rahayu", department: "HSE", position: "HSE Officer", type: "Permanent", joinDate: "2020-08-01", certExpiry: dateOffset(75) },
  { id: "EMP-0003", nik: "1001236", name: "Andi Pratama", department: "Plant", position: "Mechanic", type: "PKWT", joinDate: "2023-02-15", contractExpiry: dateOffset(45), simperExpiry: dateOffset(15) },
  { id: "EMP-0004", nik: "1001237", name: "Dewi Lestari", department: "HR", position: "HR Officer", type: "Permanent", joinDate: "2021-06-20" },
  { id: "EMP-0005", nik: "1001238", name: "Rudi Hartono", department: "Mine Operation", position: "Operator", type: "PKWT", joinDate: "2024-01-10", contractExpiry: dateOffset(25), simperExpiry: dateOffset(20) },
  { id: "EMP-0006", nik: "1001239", name: "Joko Widodo", department: "Hauling", position: "Driver", type: "Outsource", joinDate: "2022-04-01", contractExpiry: dateOffset(8), simperExpiry: dateOffset(-5) },
  { id: "EMP-0007", nik: "1001240", name: "Made Wijaya", department: "Plant", position: "Plant Foreman", type: "Permanent", joinDate: "2018-11-05", certExpiry: dateOffset(40) },
  { id: "EMP-0008", nik: "1001241", name: "Agus Salim", department: "D&B", position: "Driller", type: "PKWT", joinDate: "2023-09-20", simperExpiry: dateOffset(60) },
  { id: "EMP-0009", nik: "1001242", name: "Hendra Gunawan", department: "Survey", position: "Surveyor", type: "Permanent", joinDate: "2019-05-15" },
  { id: "EMP-0010", nik: "1001243", name: "Lina Marlina", department: "Environment", position: "Env Officer", type: "Permanent", joinDate: "2020-10-01" },
  { id: "EMP-0011", nik: "1001244", name: "Tono Sucipto", department: "Sales", position: "Sales Executive", type: "Permanent", joinDate: "2019-12-12" },
  { id: "EMP-0012", nik: "1001245", name: "Yusuf Effendi", department: "Finance", position: "Finance Controller", type: "Permanent", joinDate: "2018-07-22" },
  { id: "EMP-0013", nik: "1001246", name: "Rini Astuti", department: "QA/QC", position: "QC Lab Supervisor", type: "Permanent", joinDate: "2020-04-18" },
  { id: "EMP-0014", nik: "1001247", name: "Bambang Suryadi", department: "Hauling", position: "Driver", type: "PKWT", joinDate: "2024-03-01", simperExpiry: dateOffset(12) },
  { id: "EMP-0015", nik: "1001248", name: "Wahyu Pratama", department: "Mine Operation", position: "Operator", type: "PKWT", joinDate: "2023-07-10", simperExpiry: dateOffset(90) },
];

// ───────────────────────────────────────────────────────────────
// RISK (Module 18)
// ───────────────────────────────────────────────────────────────
export const risks: Risk[] = [
  { id: "R-001", title: "OB removal shortfall", description: "OB removal below plan for 3 consecutive days, may impact coal exposure schedule", category: "Production/Volume", ownerDept: "Mine Operation – Waste", likelihood: 4, severity: 4, residualLikelihood: 3, residualSeverity: 3, treatment: "Deploy 2 additional trucks, expedite DT-204 repair", pic: "Mine Operation Manager", dueDate: dateOffset(7), status: "Treating", nextReview: dateOffset(3) },
  { id: "R-002", title: "Hauling rate below target", description: "Coal hauling throughput 30% below plan due to weather + DT-204 breakdown", category: "Production/Volume", ownerDept: "Coal Hauling", likelihood: 4, severity: 4, residualLikelihood: 2, residualSeverity: 3, treatment: "Reroute via alternate dump, lease 1 contractor truck", pic: "Hauling Foreman", dueDate: dateOffset(5), status: "Treating", nextReview: dateOffset(2) },
  { id: "R-003", title: "Drilling rig availability tight", description: "Only 1 of 3 drill rigs operating during peak drilling week", category: "Equipment/Plant", ownerDept: "D&B", likelihood: 3, severity: 4, residualLikelihood: 2, residualSeverity: 3, treatment: "Bring DR-303 online, evaluate contractor rig", pic: "D&B Foreman", dueDate: dateOffset(4), status: "Treating", nextReview: dateOffset(2) },
  { id: "R-004", title: "Operator SIMPER expired", description: "1 hauling operator's SIMPER expired (OP-2044 / DT-204)", category: "HR/Manpower", ownerDept: "HR", likelihood: 5, severity: 4, residualLikelihood: 1, residualSeverity: 4, treatment: "Operator stood down; renewal scheduled", pic: "HR Manager", dueDate: dateOffset(1), status: "Monitored", nextReview: dateOffset(7) },
  { id: "R-005", title: "Slope stability after heavy rain", description: "Pit A north wall showing seepage after heavy rainfall", category: "Geotechnical", ownerDept: "Mine Operation", likelihood: 3, severity: 5, residualLikelihood: 2, residualSeverity: 4, treatment: "Install additional piezometers, defer mining within 30m buffer", pic: "Geotech Engineer", dueDate: dateOffset(10), status: "Treating", nextReview: dateOffset(3) },
  { id: "R-006", title: "Settling pond nearing 75% sedimentation threshold", description: "Pond SP-02 at 71% capacity, dredging scheduled next month", category: "Environmental", ownerDept: "Environment", likelihood: 3, severity: 3, residualLikelihood: 2, residualSeverity: 3, treatment: "Expedite dredging mobilization", pic: "Env Manager", dueDate: dateOffset(20), status: "Treating", nextReview: dateOffset(7) },
  { id: "R-007", title: "DMO compliance below 100%", description: "DMO realization at 92% MTD due to export prioritization", category: "Commercial", ownerDept: "Sales", likelihood: 4, severity: 4, residualLikelihood: 3, residualSeverity: 3, treatment: "Negotiate spot domestic sale to PLN", pic: "Sales Manager", dueDate: dateOffset(15), status: "Treating", nextReview: dateOffset(7) },
  { id: "R-008", title: "Off-spec barge shipment", description: "Barge BG-002 last shipment below CV spec (-180 kcal/kg), claim risk", category: "Coal Quality/Contractual", ownerDept: "QA/QC", likelihood: 3, severity: 4, residualLikelihood: 2, residualSeverity: 3, treatment: "Adjust blending recipe, claim negotiation in progress", pic: "QC Manager", dueDate: dateOffset(10), status: "Treating", nextReview: dateOffset(5) },
  { id: "R-009", title: "Maintenance budget overrun", description: "Maintenance dept YTD burn at 108% of budget, driven by unplanned repairs", category: "Financial/Cost", ownerDept: "Finance", likelihood: 4, severity: 3, residualLikelihood: 3, residualSeverity: 3, treatment: "Budget transfer from contingency, defer non-critical capex", pic: "Finance Controller", dueDate: dateOffset(14), status: "Treating", nextReview: dateOffset(7) },
  { id: "R-010", title: "Royalty payment due", description: "Royalty for last month due on the 10th, ~IDR 12.4 Bn", category: "Regulatory/Compliance", ownerDept: "Finance", likelihood: 1, severity: 4, residualLikelihood: 1, residualSeverity: 4, treatment: "Cash reserved, payment scheduled", pic: "Finance Controller", dueDate: dateOffset(27), status: "Monitored", nextReview: dateOffset(15) },
  { id: "R-011", title: "Permit AMDAL renewal", description: "AMDAL/UKL-UPL permit expires in 90 days", category: "Regulatory/Compliance", ownerDept: "Environment", likelihood: 2, severity: 4, residualLikelihood: 1, residualSeverity: 4, treatment: "Renewal application submitted to authorities", pic: "Env Manager", dueDate: dateOffset(90), status: "Treating", nextReview: dateOffset(30) },
  { id: "R-012", title: "LB3 storage approaching 90-day limit", description: "Used oil drums approaching 90-day storage cap", category: "Environmental", ownerDept: "Environment", likelihood: 3, severity: 2, residualLikelihood: 2, residualSeverity: 2, treatment: "Schedule vendor pickup this week", pic: "Env Officer", dueDate: dateOffset(7), status: "Treating", nextReview: dateOffset(3) },
  { id: "R-013", title: "Contract delivery below tolerance band", description: "Customer Acme Coal contract tracking 7% below nomination", category: "Commercial", ownerDept: "Sales", likelihood: 3, severity: 3, residualLikelihood: 2, residualSeverity: 3, treatment: "Catch-up shipment in next 2 weeks", pic: "Sales Manager", dueDate: dateOffset(20), status: "Treating", nextReview: dateOffset(7) },
  { id: "R-014", title: "Reclamation behind plan", description: "Progressive reclamation 12% behind annual S-curve", category: "Environmental", ownerDept: "Environment", likelihood: 3, severity: 3, residualLikelihood: 2, residualSeverity: 3, treatment: "Mobilize additional nursery capacity", pic: "Env Manager", dueDate: dateOffset(45), status: "Treating", nextReview: dateOffset(14) },
  { id: "R-015", title: "Community complaint – dust", description: "2 noise/dust complaints from village upstream in last 30 days", category: "Community/Social", ownerDept: "Environment", likelihood: 3, severity: 3, residualLikelihood: 2, residualSeverity: 3, treatment: "Community engagement, additional water spraying", pic: "Community Liaison", dueDate: dateOffset(10), status: "Treating", nextReview: dateOffset(7) },
  { id: "R-016", title: "Auto-suggested: discharge water exceedance", description: "TSS at outlet OP-01 above regulatory limit (85 mg/L vs 50 mg/L)", category: "Environmental", ownerDept: "Environment", likelihood: 4, severity: 3, residualLikelihood: 2, residualSeverity: 2, treatment: "Adjust dosing, retest within 24h", pic: "Env Officer", dueDate: dateOffset(1), status: "Identified", nextReview: dateOffset(1), suggested: true },
  { id: "R-017", title: "Auto-suggested: MA below target 3+ days", description: "Site MA at 78% (target 85%) for 3 consecutive days", category: "Equipment/Plant", ownerDept: "Plant", likelihood: 4, severity: 3, residualLikelihood: 3, residualSeverity: 3, treatment: "Accelerate EX-102 and DT-204 repair", pic: "Plant Manager", dueDate: dateOffset(3), status: "Identified", nextReview: dateOffset(1), suggested: true },
  { id: "R-018", title: "Auto-suggested: certification expiring", description: "3 employees with K3/POP certification expiring in <30 days", category: "HR/Manpower", ownerDept: "HR", likelihood: 3, severity: 3, residualLikelihood: 2, residualSeverity: 2, treatment: "Schedule refresher training", pic: "HR Manager", dueDate: dateOffset(20), status: "Identified", nextReview: dateOffset(7), suggested: true },
];

// ───────────────────────────────────────────────────────────────
// SALES & ROYALTY (Module 15)
// ───────────────────────────────────────────────────────────────
export const contracts: Contract[] = [
  { id: "C-2024-001", customer: "Acme Coal International (Export)", type: "Term", annualQty: 1_200_000, deliveredMTD: 78_500, deliveredYTD: 642_000, deliveredLTD: 4_120_000, basePrice: 88, currency: "USD" },
  { id: "C-2024-002", customer: "Buana Energy (Export)", type: "Term", annualQty: 800_000, deliveredMTD: 52_000, deliveredYTD: 470_000, deliveredLTD: 2_640_000, basePrice: 92, currency: "USD" },
  { id: "C-2024-003", customer: "PLN (Domestic DMO)", type: "Framework", annualQty: 500_000, deliveredMTD: 28_000, deliveredYTD: 215_000, deliveredLTD: 1_580_000, basePrice: 70, currency: "USD", dmo: true },
  { id: "C-2024-004", customer: "Spot – Asian Buyer", type: "Spot", annualQty: 100_000, deliveredMTD: 8_000, deliveredYTD: 75_000, deliveredLTD: 312_000, basePrice: 85, currency: "USD" },
];

export const royaltyRows: RoyaltyRow[] = [
  { period: "2026-09", contract: "C-2024-001", volumeTonnes: 78_000, benchmarkPrice: 88.2, realizedPrice: 87.5, royaltyBase: 88.2, ratePct: 5, royaltyIDR: 5_503_000_000, paid: true, dueDate: "2026-10-10" },
  { period: "2026-09", contract: "C-2024-002", volumeTonnes: 55_000, benchmarkPrice: 88.2, realizedPrice: 90.1, royaltyBase: 90.1, ratePct: 5, royaltyIDR: 3_960_000_000, paid: true, dueDate: "2026-10-10" },
  { period: "2026-09", contract: "C-2024-003", volumeTonnes: 27_000, benchmarkPrice: 88.2, realizedPrice: 70, royaltyBase: 88.2, ratePct: 5, royaltyIDR: 1_905_000_000, paid: true, dueDate: "2026-10-10" },
  { period: "2026-09", contract: "C-2024-004", volumeTonnes: 9_000, benchmarkPrice: 88.2, realizedPrice: 85, royaltyBase: 88.2, ratePct: 5, royaltyIDR: 635_000_000, paid: true, dueDate: "2026-10-10" },
  { period: "2026-10", contract: "C-2024-001", volumeTonnes: 38_000, benchmarkPrice: 87.5, realizedPrice: 88, royaltyBase: 88, ratePct: 5, royaltyIDR: 2_673_000_000, paid: false, dueDate: "2026-11-10" },
  { period: "2026-10", contract: "C-2024-002", volumeTonnes: 22_000, benchmarkPrice: 87.5, realizedPrice: 91, royaltyBase: 91, ratePct: 5, royaltyIDR: 1_602_000_000, paid: false, dueDate: "2026-11-10" },
  { period: "2026-10", contract: "C-2024-003", volumeTonnes: 12_000, benchmarkPrice: 87.5, realizedPrice: 70, royaltyBase: 87.5, ratePct: 5, royaltyIDR: 841_000_000, paid: false, dueDate: "2026-11-10" },
];

// ───────────────────────────────────────────────────────────────
// COST & BUDGET (Module 16)
// ───────────────────────────────────────────────────────────────
export const budgetLines: BudgetLine[] = [
  { department: "Mine Operation", costElement: "Contractor OB removal", mtdPlan: 5_400_000_000, mtdActual: 5_280_000_000, ytdPlan: 54_000_000_000, ytdActual: 51_200_000_000, ytdPlanTotal: 64_800_000_000, currency: "IDR" },
  { department: "Mine Operation", costElement: "Fuel & lubricants", mtdPlan: 1_800_000_000, mtdActual: 1_910_000_000, ytdPlan: 18_000_000_000, ytdActual: 18_950_000_000, ytdPlanTotal: 21_600_000_000, currency: "IDR" },
  { department: "Coal Hauling", costElement: "Contractor hauling", mtdPlan: 2_200_000_000, mtdActual: 2_120_000_000, ytdPlan: 22_000_000_000, ytdActual: 20_800_000_000, ytdPlanTotal: 26_400_000_000, currency: "IDR" },
  { department: "Plant & Maintenance", costElement: "Spare parts & consumables", mtdPlan: 1_100_000_000, mtdActual: 1_350_000_000, ytdPlan: 11_000_000_000, ytdActual: 11_900_000_000, ytdPlanTotal: 13_200_000_000, currency: "IDR" },
  { department: "Plant & Maintenance", costElement: "Workshop contractor", mtdPlan: 480_000_000, mtdActual: 560_000_000, ytdPlan: 4_800_000_000, ytdActual: 5_100_000_000, ytdPlanTotal: 5_760_000_000, currency: "IDR" },
  { department: "D&B", costElement: "Explosives & accessories", mtdPlan: 780_000_000, mtdActual: 712_000_000, ytdPlan: 7_800_000_000, ytdActual: 7_120_000_000, ytdPlanTotal: 9_360_000_000, currency: "IDR" },
  { department: "HSE", costElement: "PPE & training", mtdPlan: 220_000_000, mtdActual: 215_000_000, ytdPlan: 2_200_000_000, ytdActual: 2_080_000_000, ytdPlanTotal: 2_640_000_000, currency: "IDR" },
  { department: "Environment", costElement: "Reclamation & monitoring", mtdPlan: 320_000_000, mtdActual: 280_000_000, ytdPlan: 3_200_000_000, ytdActual: 2_810_000_000, ytdPlanTotal: 3_840_000_000, currency: "IDR" },
  { department: "HR", costElement: "Manpower & training", mtdPlan: 1_400_000_000, mtdActual: 1_380_000_000, ytdPlan: 14_000_000_000, ytdActual: 13_750_000_000, ytdPlanTotal: 16_800_000_000, currency: "IDR" },
  { department: "Sales & Marketing", costElement: "Marketing & logistics", mtdPlan: 180_000_000, mtdActual: 165_000_000, ytdPlan: 1_800_000_000, ytdActual: 1_720_000_000, ytdPlanTotal: 2_160_000_000, currency: "IDR" },
  { department: "Finance & Admin", costElement: "Insurance & permits", mtdPlan: 260_000_000, mtdActual: 245_000_000, ytdPlan: 2_600_000_000, ytdActual: 2_510_000_000, ytdPlanTotal: 3_120_000_000, currency: "IDR" },
];

// ───────────────────────────────────────────────────────────────
// RECONCILIATION (Module 12)
// ───────────────────────────────────────────────────────────────
export const reconciliations: Reconciliation[] = [
  { period: "2026-09", pit: "Pit A", material: "OB", surveyTonnes: 0, truckCountTonnes: 0, varianceTonnes: 0, variancePct: 2.1, status: "ADJUSTED", rootCause: "Within tolerance" },
  { period: "2026-09", pit: "Pit A", material: "Coal", surveyTonnes: 0, truckCountTonnes: 0, varianceTonnes: 0, variancePct: 1.8, status: "ADJUSTED", rootCause: "Within tolerance" },
  { period: "2026-09", pit: "Pit B", material: "OB", surveyTonnes: 0, truckCountTonnes: 0, varianceTonnes: 0, variancePct: 7.4, status: "UNDER_INVESTIGATION", rootCause: "Possible rehandle on overburden route" },
  { period: "2026-09", pit: "Pit B", material: "Coal", surveyTonnes: 0, truckCountTonnes: 0, varianceTonnes: 0, variancePct: 3.2, status: "ADJUSTED", rootCause: "Within tolerance" },
  { period: "2026-10", pit: "Pit A", material: "OB", surveyTonnes: 0, truckCountTonnes: 0, varianceTonnes: 0, variancePct: 1.5, status: "OK", rootCause: "TBD" },
  { period: "2026-10", pit: "Pit A", material: "Coal", surveyTonnes: 0, truckCountTonnes: 0, varianceTonnes: 0, variancePct: 8.9, status: "UNDER_INVESTIGATION", rootCause: "Higher moisture than usual; payload dev" },
  { period: "2026-10", pit: "Pit B", material: "OB", surveyTonnes: 0, truckCountTonnes: 0, varianceTonnes: 0, variancePct: 6.1, status: "UNDER_INVESTIGATION", rootCause: "Rehandle suspected" },
];

// ───────────────────────────────────────────────────────────────
// ENVIRONMENT (Module 13)
// ───────────────────────────────────────────────────────────────
export const envRecords: EnvRecord[] = [
  { date: dateOffset(-1), point: "OP-01 (TSS)", parameter: "TSS", value: 85, limit: 50, exceedance: true },
  { date: dateOffset(-2), point: "OP-01 (TSS)", parameter: "TSS", value: 42, limit: 50, exceedance: false },
  { date: dateOffset(-3), point: "OP-01 (TSS)", parameter: "TSS", value: 38, limit: 50, exceedance: false },
  { date: dateOffset(-1), point: "OP-01 (pH)", parameter: "pH", value: 7.2, limit: 9, exceedance: false },
  { date: dateOffset(-1), point: "OP-02 (TSS)", parameter: "TSS", value: 30, limit: 50, exceedance: false },
  { date: dateOffset(-2), point: "OP-02 (pH)", parameter: "pH", value: 7.6, limit: 9, exceedance: false },
  { date: dateOffset(-3), point: "OP-02 (Debit)", parameter: "Debit", value: 12, limit: 25, exceedance: false },
  { date: dateOffset(-1), point: "OP-03 (Oil & Grease)", parameter: "OilGrease", value: 3, limit: 5, exceedance: false },
  { date: dateOffset(-1), point: "Rainfall Station 1", parameter: "Debit", value: 18, limit: 100, exceedance: false },
];

// ───────────────────────────────────────────────────────────────
// COAL QUALITY (Module 14)
// ───────────────────────────────────────────────────────────────
export const qualitySamples: QualitySample[] = [
  { id: "QC-001", date: dateOffset(-1), location: "Pit A Seam B", cvGAR: 6420, tm: 11.0, ash: 5.2, ts: 0.42, im: 7.0, vm: 38.0, fc: 49.6, pass: true },
  { id: "QC-002", date: dateOffset(-1), location: "Pit B Seam A", cvGAR: 5980, tm: 12.5, ash: 7.8, ts: 0.55, im: 7.5, vm: 36.5, fc: 47.5, pass: true },
  { id: "QC-003", date: dateOffset(-1), location: "ROM Average", cvGAR: 6250, tm: 11.5, ash: 6.0, ts: 0.48, im: 7.2, vm: 37.5, fc: 48.8, pass: true },
  { id: "QC-004", date: dateOffset(-1), location: "Stockpile SP-01", cvGAR: 6280, tm: 11.2, ash: 5.8, ts: 0.45, im: 7.0, vm: 37.8, fc: 48.7, pass: true },
  { id: "QC-005", date: dateOffset(-1), location: "Barge BG-001", cvGAR: 6320, tm: 10.8, ash: 5.5, ts: 0.42, im: 6.8, vm: 38.0, fc: 49.0, pass: true },
  { id: "QC-006", date: dateOffset(-1), location: "Barge BG-002", cvGAR: 6020, tm: 12.0, ash: 7.5, ts: 0.50, im: 7.4, vm: 36.8, fc: 47.8, pass: false },
  { id: "QC-007", date: dateOffset(-1), location: "Barge BG-003", cvGAR: 6300, tm: 11.0, ash: 5.6, ts: 0.43, im: 7.0, vm: 37.9, fc: 48.8, pass: true },
];

// ───────────────────────────────────────────────────────────────
// SHIPMENTS (Module 15 — sales records)
// ───────────────────────────────────────────────────────────────
export const shipments: Shipment[] = [
  { id: "SHP-2026-101", date: dateOffset(-1), contract: "C-2024-001", barge: "BG-001", tonnes: 7800, cvGAR: 6320, specCV: 6300, specAsh: 6.0, specTM: 12.0, specTS: 0.5, ash: 5.5, tm: 10.8, ts: 0.42, priceRealized: 88.5, invoiceStatus: "Invoiced" },
  { id: "SHP-2026-102", date: dateOffset(-1), contract: "C-2024-002", barge: "BG-003", tonnes: 7900, cvGAR: 6300, specCV: 6300, specAsh: 6.0, specTM: 12.0, specTS: 0.5, ash: 5.6, tm: 11.0, ts: 0.43, priceRealized: 91.0, invoiceStatus: "Invoiced" },
  { id: "SHP-2026-103", date: dateOffset(-2), contract: "C-2024-003", barge: "BG-002", tonnes: 7700, cvGAR: 6020, specCV: 6300, specAsh: 6.0, specTM: 12.0, specTS: 0.5, ash: 7.5, tm: 12.0, ts: 0.50, priceRealized: 70.0, invoiceStatus: "Paid" },
  { id: "SHP-2026-100", date: dateOffset(-2), contract: "C-2024-001", barge: "BG-001", tonnes: 7800, cvGAR: 6350, specCV: 6300, specAsh: 6.0, specTM: 12.0, specTS: 0.5, ash: 5.2, tm: 10.5, ts: 0.40, priceRealized: 88.0, invoiceStatus: "Paid" },
];

// ───────────────────────────────────────────────────────────────
// EXECUTIVE SUMMARY (Module 19) — pre-generated, approved
// ───────────────────────────────────────────────────────────────
export const executiveSummary: ExecutiveSummary = {
  generatedAt: dateOffset(-1) + " 06:00",
  period: "MTD 2026-10",
  approvedBy: "General Manager",
  headline:
    "MTD 2026-10 production tracking at 91% with OB and Hauling underperforming due to weather and equipment breakdowns; sales on plan, DMO compliance 92%, no LTI, and one discharge exceedance under remediation.",
  sections: {
    safety:
      "Man-hours MTD 184,220, zero LTI and zero fatality. Days Without LTI stands at 312. One High-risk safety issue (slip hazard on KM 4.2) is in remediation. PPE compliance 98.4%. TBT and inspections on track.",
    production:
      "Coal Getting MTD 198,000 t (98% of plan); Coal Hauling 188,000 t (88% — below plan due to weather + DT-204 breakdown); Load to Barge 178,000 t (89% — pulled down by hauling shortfall). OB removal 612,000 BCM (76% — 3 weak days from weather and EX-102/DT-204 downtime). Drilling 1,420 m (95%). Land Clearing 28 Ha (78% — permit delay).",
    quality:
      "Spec compliance 92%. Barge BG-002 last shipment off-spec (CV 6,020 vs 6,300 kcal/kg; Ash 7.5% vs 6.0% max) — claim negotiation in progress. Blending recipe deviation flagged at SP-02. ROM and most barges within spec.",
    environment:
      "One TSS exceedance at outlet OP-01 (85 mg/L vs 50 mg/L limit) — retest scheduled within 24h. Settling pond SP-02 at 71% sedimentation (below 75% threshold). Reclamation 12% behind annual S-curve. LB3 used oil near 90-day cap; vendor pickup scheduled. AMDAL renewal in progress (90 days to expiry).",
    commercial:
      "Acme Coal 78,500 t MTD (97% of nomination). Buana Energy 52,000 t (92% — below tolerance). PLN DMO 28,000 t (DMO compliance 92% — risk of surcharge). Spot 8,000 t. Royalty last month paid in full; this month due 10 Nov ~IDR 5.1 Bn.",
    cost:
      "MTD burn IDR 14.2 Bn vs plan IDR 14.1 Bn (100.7%). YTD burn 91% of annual budget. Maintenance department YTD at 108% of budget (unplanned repairs). Unit cost OB IDR 23,500/BCM (vs target 24,000), Coal Hauling IDR 11,300/t (on target). FX rate 15,800 IDR/USD.",
    coalAccount:
      "Closing stock MTD 142,000 t at average CV 6,250 kcal/kg. Mass balance variance +1.2% (within tolerance). Inventory value IDR 178 Bn at realized price. Last month closed with +0.6% variance. Current month in Draft.",
    bottleneck:
      "Most probable bottleneck is the OB Removal shortfall driven by equipment (EX-102 hydraulic pump + DT-204 engine overheating) compounded by weather. This propagates upstream as reduced blasted material readiness, and downstream as reduced hauling throughput.",
    equipment:
      "Site MA 78% (target 85%) — 3-day streak. PA 84%. EU 86%. Top bad actors: EX-102, DT-204. 8 open WOs, 2 critical (DT-204, EX-102). Backlog 178 hours (target 120).",
    hr:
      "Headcount 542 (plan 560 — 96%). Absenteeism 4.2%. 1 operator's SIMPER expired (OP-2044) — stood down, renewal scheduled. 3 K3/POP certifications expiring within 30 days — refresher training scheduled. Local:expat 96:4.",
    dataQuality:
      "Reconciliation: Sept closed with 2 out-of-tolerance cases (Pit B OB 7.4%, Pit A Coal 8.9% pending review). Daily truck count data quality generally good; payload entry deviations on Pit A flagged for surveyor cross-check.",
    risks:
      "Top 5 by residual: R-001 OB shortfall (12), R-002 Hauling shortfall (6), R-005 Slope stability (8), R-007 DMO compliance (9), R-008 Off-spec shipment (6). 3 auto-suggested risks pending review (discharge exceedance, MA below target, certification expiry).",
    conclusions:
      "1) Accelerate EX-102 and DT-204 repair to restore fleet MA. 2) Catch-up OB removal via additional contractor trucks to protect coal exposure schedule. 3) Settle DMO shortfall with PLN spot nomination. 4) Close-out barge off-spec claim. 5) Pre-empt settling pond SP-02 dredging mobilization.",
  },
};

export const dashboardKPIs = {
  fleetReady: equipment.filter((e) => e.status === "Operating" || e.status === "Standby").length,
  totalEquipment: equipment.length,
  openWOs: workOrders.filter((w) => !["Closed", "Verified", "Completed"].includes(w.status)).length,
  backlogHours: workOrders.filter((w) => w.status === "InProgress" || w.status === "Scheduled").reduce((a, w) => a + w.downtimeHours, 0),
  manpowerPresentPct: 95.8,
  certExpiring30d: employees.filter((e) => {
    if (!e.simperExpiry && !e.certExpiry) return false;
    const exp = e.simperExpiry || e.certExpiry;
    if (!exp) return false;
    const days = (new Date(exp).getTime() - new Date(today).getTime()) / 86400000;
    return days <= 30 && days >= 0;
  }).length,
  qualitySpecCompliancePct: 92,
  openEnvAlerts: envRecords.filter((r) => r.exceedance).length,
  openHighRisks: risks.filter((r) => r.residualLikelihood * r.residualSeverity >= 9 && r.status !== "Closed").length,
  salesVsContractPct: 95,
  dmoCompliancePct: 92,
  budgetBurnYtdPct: 91,
  siteMA: 78,
  sitePA: 84,
  siteEU: 86,
  targets: { ma: 85, pa: 90, eu: 88 },
};
