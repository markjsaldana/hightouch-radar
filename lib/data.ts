import competitorsJson from "@/data/competitors.json";
import sourcesJson from "@/data/sources.json";
import signalTypesJson from "@/data/signal_types.json";
import rulesJson from "@/data/rules.json";
import signalsJson from "@/data/signals.json";
import digestJson from "@/data/digest.json";
import battlecardJson from "@/data/battlecard_segment.json";
import matrixJson from "@/data/matrix.json";
import routingLogJson from "@/data/routing_log.json";
import customersJson from "@/data/customers.json";
import caseStudiesJson from "@/data/case_studies.json";
import transcriptDemoJson from "@/data/transcript_demo.json";
import type {
  Battlecard,
  CaseStudy,
  Competitor,
  Customer,
  Digest,
  Matrix,
  RoutingLog,
  Rules,
  Signal,
  SignalType,
  Source,
  TranscriptDemo,
} from "@/lib/types";

// Every page reads from /data through here, so swapping sample data for real
// data never touches the UI. JSON imports widen string unions, so the enum
// fields are validated by `npm run check:data` instead of the compiler.
export const competitors = competitorsJson as Competitor[];
export const sources = sourcesJson as Source[];
export const signalTypes = signalTypesJson as SignalType[];
export const rules = rulesJson as Rules;
export const signals = signalsJson as Signal[];
export const digest = digestJson as Digest;
export const battlecard = battlecardJson as Battlecard;
export const matrix = matrixJson as Matrix;
export const routingLog = routingLogJson as RoutingLog;
export const customers = customersJson as Customer[];
export const caseStudies = caseStudiesJson as CaseStudy[];
export const transcriptDemo = transcriptDemoJson as TranscriptDemo;

const categoryLabel = "Category-wide";

export function competitorName(id: string) {
  if (id === "category") return categoryLabel;
  return competitors.find((c) => c.id === id)?.name ?? id;
}

export function signalTypeLabel(id: string) {
  return signalTypes.find((t) => t.id === id)?.label ?? id;
}

export function signalById(id: number) {
  return signals.find((s) => s.id === id);
}

export function customerById(id: string) {
  return customers.find((c) => c.id === id);
}

export function caseStudyById(id: string) {
  return caseStudies.find((c) => c.id === id);
}
