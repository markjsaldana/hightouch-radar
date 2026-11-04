export type Tier = "Primary" | "Secondary" | "Watch";
// Owner: the shop owner. Office: office manager, CSR, dispatcher. Tech: field technician. Ops: GM or ops lead at larger shops.
export type Persona = "Owner" | "Office" | "Tech" | "Ops";
export type Confidence = "Confirmed" | "Likely" | "Rumor";
export type Urgency = "Alert now" | "This week's digest" | "Monthly review";
export type Owner = "Sales" | "SDRs" | "Sales leadership" | "PMM" | "Product" | "Website" | "CS" | "Enablement";
export type SignalStatus = "Alert sent" | "Talk track shipped" | "In review" | "Gap logged" | "Page updated" | "Logged";

export type Competitor = {
  id: string;
  name: string;
  parent: string | null;
  tier: Tier;
  category: string;
  competesFor: Persona[];
  whyTheyWin: string;
  facts: { fact: string; source: string }[];
};

export type SourceType =
  | "pricing page"
  | "product updates"
  | "blog"
  | "comparison page"
  | "help center"
  | "careers"
  | "app marketplace"
  | "investor news"
  | "webinar/events"
  | "review themes"
  | "win-loss notes"
  | "call mentions"
  | "mystery-shop calls"
  | "CS notes";

export type Source = {
  id: string;
  competitorId: string;
  type: SourceType;
  url: string;
  internal: boolean;
  frequency: "Daily" | "Weekly" | "Monthly" | "Continuous";
  lookFor: string;
  snapshot?: string;
};

export type SignalType = {
  id: string;
  label: string;
  description: string;
  example: string;
};

export type Rules = {
  dealImpact: { score: number; label: string }[];
  personas: { id: Persona; needs: string }[];
  urgency: { id: Urgency; when: string }[];
  confidence: { id: Confidence; when: string }[];
  routing: { when: string; to: Owner[]; action: string }[];
};

export type Signal = {
  id: number;
  weekOf: string;
  date: string;
  competitorId: string;
  sourceId: string;
  type: string;
  change: string;
  whyItMatters: string;
  whatToSay: string;
  personas: Persona[];
  impact: 1 | 2 | 3 | 4 | 5;
  confidence: Confidence;
  urgency: Urgency;
  owners: Owner[];
  status: SignalStatus;
};

export type Digest = {
  weekOf: string;
  topForSales: number[];
  trends: { title: string; detail: string; signals: number[] }[];
  winLossQuestions: { question: string; gap: string }[];
};

export type ProofType = "Customer story" | "Demo moment" | "Cost math";

export type Battlecard = {
  competitorId: string;
  updatedOn: string;
  updatedBySignals: { signal: number; section: string; change: string }[];
  quickDismiss: string;
  whereWeWin: { point: string; detail: string; proofType: ProofType; proof: string }[];
  whereTheyWin: { point: string; handle: string }[];
  landmines: string[];
  objections: { objection: string; response: string }[];
  byPersona: { persona: Persona; theyCareAbout: string; lead: string; avoid: string; proofPoint: string }[];
};

export type MatrixMark = "yes" | "partial" | "no";

export type Matrix = {
  players: { id: string; name: string }[];
  groups: {
    persona: Persona;
    capabilities: {
      name: string;
      cells: Record<string, { mark: MatrixMark; note: string }>;
    }[];
  }[];
  positioning: {
    xAxis: { low: string; high: string };
    yAxis: { low: string; high: string };
    // label: which side of the dot the name sits on. Defaults to right, or left near the right edge.
    points: { id: string; name: string; x: number; y: number; note: string; label?: "top" | "left" | "right" }[];
  };
};

export type RoutingEntry = {
  date: string;
  signal: number;
  destination: string;
  action: string;
  outcome: string;
  kind: "Sales alert" | "Product" | "PMM" | "Website" | "CS" | "Win-loss";
};

export type Kpi = {
  name: string;
  why: string;
  measure: string;
  target: string;
};

export type RoutingLog = {
  entries: RoutingEntry[];
  kpis: Kpi[];
};

export type Region = "West" | "Southwest" | "Midwest" | "Southeast" | "Northeast" | "Canada";
// Small: 1 to 5 techs. Mid-size: 6 to 20. Large: 21 or more.
export type CompanySize = "Small" | "Mid-size" | "Large";
export type UseCase =
  | "Scheduling & dispatch"
  | "Online booking"
  | "Estimates & price book"
  | "Invoicing & payments"
  | "Consumer financing"
  | "Service plans"
  | "Marketing & reviews"
  | "Reporting";
export type ReferenceStatus = "Available" | "Limited" | "Resting";
export type ReferenceFormat = "Reference call" | "Peer email" | "Site visit" | "Webinar";

export type Customer = {
  id: string;
  name: string;
  industry: string;
  size: CompanySize;
  region: Region;
  hq: string;
  // [longitude, latitude] of the HQ city, for the references map.
  coords: [number, number];
  // Team size as the customer describes it, e.g. "14 techs, 3 office".
  team: string;
  useCases: UseCase[];
  competitor: { id: string; outcome: "Switched from" | "Chose over" } | null;
  // null: a customer with a case study who hasn't agreed to take reference calls.
  reference: {
    status: ReferenceStatus;
    contactRole: string;
    personas: Persona[];
    formats: ReferenceFormat[];
    lastUsed: string;
    goodFor: string;
  } | null;
};

export type CaseStudy = {
  id: string;
  customerId: string;
  title: string;
  visibility: "Public" | "Internal only";
  useCases: UseCase[];
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
  quote: { text: string; role: string };
};

// What the deal assistant demo pulls out of one sample call transcript.
// Concern and resource numbers in `addresses` and `form` are 1-based ranks;
// `objection` and an objection resource's `ref` index the objections on the
// battlecard for the prospect's competitor.
export type DealResource = {
  kind: "caseStudy" | "reference" | "objection";
  ref: string;
  addresses: number[];
  why: string;
};

// A follow-up email draft. `resource` is the 1-based rank of a resource to link.
export type DemoEmail = {
  to: string;
  subject: string;
  paragraphs: { text: string; resource?: number; linkText?: string }[];
  signoff: string;
};

export type TranscriptDemo = {
  file: { name: string; path: string; source: string; duration: string; speakers: number };
  prospect: {
    name: string;
    industry: string;
    size: CompanySize;
    region: Region;
    personas: Persona[];
    competitorId: string;
    stage: string;
    nextStep: string;
  };
  parsing: string[];
  concerns: { concern: string; quote: string; speaker: string; at: string; mentions: number; objection?: number }[];
  resources: DealResource[];
  email: DemoEmail;
  form: {
    fields: { label: string; value: string }[];
    concerns: number[];
    resources: number[];
    missed: string;
    email: DemoEmail;
  };
};

// The weekly "so what": what this week's signals mean for each audience.
export type SoWhatItem = { title: string; detail: string; action: string; signals: number[] };

export type SoWhat = {
  weekOf: string;
  headline: string;
  audiences: { id: string; label: string; who: string; summary: string; items: SoWhatItem[] }[];
};
