export type Lang = "en" | "id";

export type Period = "daily" | "yesterday" | "mtd" | "ytd" | "ltd";

export type Status = "ok" | "warning" | "danger" | "info";

export type AchColor = "green" | "yellow" | "red" | "grey";

export function achColor(achPct: number): AchColor {
  if (!isFinite(achPct)) return "grey";
  if (achPct >= 95) return "green";
  if (achPct >= 80) return "yellow";
  return "red";
}

export interface SafetyKPI {
  manHoursMTD: number;
  manHoursYTD: number;
  manHoursLTD: number;
  daysWithoutLTI: number;
  daysWithoutFatality: number;
  ltifr: number;
  trifr: number;
  counts: {
    fatality: number;
    lti: number;
    mtc: number;
    rwc: number;
    fac: number;
    firstAid: number;
    nearMiss: number;
    pdu: number;
  };
  ppeCompliancePct: number;
  tbtHeld: number;
  inspectionsOpen: number;
  inspectionsClosed: number;
  permitsActive: number;
  openIssues: number;
  highRiskOpen: number;
}

export interface ProductionActual {
  stage: ProductionStage;
  date: string; // YYYY-MM-DD
  shift: 1 | 2;
  location: string;
  planTonnes: number;
  actualTonnes: number;
  planBCM?: number;
  actualBCM?: number;
  remarks?: string;
  cause?: string;
  surveyAdjustedTonnes?: number;
  equipmentIds?: string[];
}

export type ProductionStage =
  | "loadToBarge"
  | "coalHauling"
  | "crushing"
  | "coalGetting"
  | "obRemoval"
  | "drillingBlasting"
  | "landClearing";

export interface Equipment {
  id: string;
  code: string;
  class: "Excavator" | "DumpTruck" | "Dozer" | "Loader" | "Crane" | "Grader" | "DrillRig" | "Barge" | "Conveyor";
  make: string;
  model: string;
  capacity: string;
  status: "Operating" | "Standby" | "Breakdown" | "UnderPM" | "Available";
  site: string;
  hmTotal: number;
  utilizationPct: number;
  assignedOperator?: string;
  operatorSIMPERExpiry?: string;
}

export interface SafetyIssue {
  id: string;
  date: string;
  description: string;
  category: string;
  location: string;
  riskLevel: "Low" | "Medium" | "High";
  pic: string;
  dueDate: string;
  status: "Open" | "InProgress" | "Closed";
}

export interface WorkOrder {
  id: string;
  unit: string;
  type: "Breakdown" | "PM-250" | "PM-500" | "PM-1000" | "PM-2000" | "Predictive" | "Modification";
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Requested" | "Approved" | "Scheduled" | "InProgress" | "Completed" | "Verified" | "Closed";
  openDate: string;
  dueDate: string;
  downtimeHours: number;
  costIDR: number;
}

export interface Employee {
  id: string;
  nik: string;
  name: string;
  department: string;
  position: string;
  type: "Permanent" | "PKWT" | "Outsource";
  joinDate: string;
  contractExpiry?: string;
  simperExpiry?: string;
  certExpiry?: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  ownerDept: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  severity: 1 | 2 | 3 | 4 | 5;
  residualLikelihood: 1 | 2 | 3 | 4 | 5;
  residualSeverity: 1 | 2 | 3 | 4 | 5;
  treatment: string;
  pic: string;
  dueDate: string;
  status: "Identified" | "Assessed" | "Treating" | "Monitored" | "Closed";
  nextReview: string;
  suggested?: boolean;
}

export interface Contract {
  id: string;
  customer: string;
  type: "Term" | "Spot" | "Framework";
  annualQty: number;
  deliveredMTD: number;
  deliveredYTD: number;
  deliveredLTD: number;
  basePrice: number; // USD/t
  currency: "USD" | "IDR";
  dmo?: boolean;
}

export interface BudgetLine {
  department: string;
  costElement: string;
  mtdPlan: number;
  mtdActual: number;
  ytdPlan: number;
  ytdActual: number;
  ytdPlanTotal: number;
  currency: "IDR" | "USD";
}

export interface RoyaltyRow {
  period: string; // YYYY-MM
  contract: string;
  volumeTonnes: number;
  benchmarkPrice: number;
  realizedPrice: number;
  royaltyBase: number;
  ratePct: number;
  royaltyIDR: number;
  paid: boolean;
  dueDate: string;
}

export interface Reconciliation {
  period: string;
  pit: string;
  material: "OB" | "Coal";
  surveyTonnes: number;
  truckCountTonnes: number;
  varianceTonnes: number;
  variancePct: number;
  status: "OK" | "UNDER_INVESTIGATION" | "ADJUSTED";
  rootCause?: string;
}

export interface EnvRecord {
  date: string;
  point: string;
  parameter: "pH" | "TSS" | "Fe" | "Mn" | "OilGrease" | "Debit";
  value: number;
  limit: number;
  exceedance: boolean;
}

export interface QualitySample {
  id: string;
  date: string;
  location: string; // pit, ROM, stockpile, barge
  cvGAR: number; // kcal/kg
  tm: number; // %
  ash: number; // %
  ts: number; // %
  im: number;
  vm: number;
  fc: number;
  pass: boolean;
}

export interface Shipment {
  id: string;
  date: string;
  contract: string;
  barge: string;
  tonnes: number;
  cvGAR: number;
  specCV: number;
  specAsh: number;
  specTM: number;
  specTS: number;
  ash: number;
  tm: number;
  ts: number;
  priceRealized: number;
  invoiceStatus: "Invoiced" | "Paid" | "Overdue";
}

export interface ExecutiveSummary {
  generatedAt: string;
  period: string;
  approvedBy: string;
  headline: string;
  sections: {
    safety: string;
    production: string;
    quality: string;
    environment: string;
    commercial: string;
    cost: string;
    coalAccount: string;
    bottleneck: string;
    equipment: string;
    hr: string;
    dataQuality: string;
    risks: string;
    conclusions: string;
  };
}
