// Cross-file checks the type system can't express: every reference points at
// something that exists. Run with `npm run check:data`.
import { readFileSync } from "node:fs";

const load = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url)));
const competitors = new Set(load("competitors.json").map((c) => c.id).concat("category"));
const sources = load("sources.json");
const sourceIds = new Set(sources.map((s) => s.id));
const types = new Set(load("signal_types.json").map((t) => t.id));
const signals = load("signals.json");
const signalIds = new Set(signals.map((s) => s.id));
const errors = [];

const enums = {
  tier: ["Primary", "Secondary", "Watch"],
  persona: ["Marketing", "Data", "Product", "Exec"],
  confidence: ["Confirmed", "Likely", "Rumor"],
  urgency: ["Alert now", "This week's digest", "Monthly review"],
  owner: ["Sales", "Sales leadership", "PMM", "Product", "Website", "CS", "Enablement"],
  status: ["Alert sent", "Talk track shipped", "In review", "Gap logged", "Page updated", "Logged"],
  region: ["North America", "EMEA", "APAC", "LATAM"],
  size: ["Commercial", "Mid-market", "Enterprise"],
  useCase: [
    "Audience activation",
    "Lifecycle marketing",
    "Paid media",
    "AI Decisioning",
    "Personalization",
    "Identity resolution",
    "Data governance",
    "Sales & CRM sync",
  ],
  outcome: ["Replaced", "Runs alongside", "Chose over"],
  referenceStatus: ["Available", "Limited", "Resting"],
  format: ["Reference call", "Peer email", "Site visit", "Webinar"],
  visibility: ["Public", "Internal only"],
};
const checkEnum = (where, kind, value) => {
  if (!enums[kind].includes(value)) errors.push(`${where}: invalid ${kind} "${value}"`);
};

for (const c of load("competitors.json")) {
  checkEnum(`competitor ${c.id}`, "tier", c.tier);
  c.competesFor.forEach((p) => checkEnum(`competitor ${c.id}`, "persona", p));
}

for (const s of sources) if (!competitors.has(s.competitorId)) errors.push(`source ${s.id}: unknown competitor ${s.competitorId}`);
for (const s of signals) {
  if (!competitors.has(s.competitorId)) errors.push(`signal ${s.id}: unknown competitor ${s.competitorId}`);
  if (!sourceIds.has(s.sourceId)) errors.push(`signal ${s.id}: unknown source ${s.sourceId}`);
  if (!types.has(s.type)) errors.push(`signal ${s.id}: unknown type ${s.type}`);
  if (![1, 2, 3, 4, 5].includes(s.impact)) errors.push(`signal ${s.id}: impact must be 1-5`);
  checkEnum(`signal ${s.id}`, "confidence", s.confidence);
  checkEnum(`signal ${s.id}`, "urgency", s.urgency);
  checkEnum(`signal ${s.id}`, "status", s.status);
  s.personas.forEach((p) => checkEnum(`signal ${s.id}`, "persona", p));
  s.owners.forEach((o) => checkEnum(`signal ${s.id}`, "owner", o));
}
const digest = load("digest.json");
const refs = [
  ...digest.topForSales,
  ...digest.trends.flatMap((t) => t.signals),
  ...load("battlecard_segment.json").updatedBySignals.map((u) => u.signal),
  ...load("routing_log.json").entries.map((e) => e.signal),
];
for (const id of refs) if (!signalIds.has(id)) errors.push(`reference to missing signal #${id}`);

const customers = load("customers.json");
const customerIds = new Set(customers.map((c) => c.id));
for (const c of customers) {
  const where = `customer ${c.id}`;
  checkEnum(where, "region", c.region);
  checkEnum(where, "size", c.size);
  c.useCases.forEach((u) => checkEnum(where, "useCase", u));
  if (c.competitor) {
    if (!competitors.has(c.competitor.id)) errors.push(`${where}: unknown competitor ${c.competitor.id}`);
    checkEnum(where, "outcome", c.competitor.outcome);
  }
  if (c.reference) {
    checkEnum(where, "referenceStatus", c.reference.status);
    c.reference.personas.forEach((p) => checkEnum(where, "persona", p));
    c.reference.formats.forEach((f) => checkEnum(where, "format", f));
  }
}
const caseStudies = load("case_studies.json");
const caseStudyIds = new Set(caseStudies.map((c) => c.id));
for (const cs of caseStudies) {
  if (!customerIds.has(cs.customerId)) errors.push(`case study ${cs.id}: unknown customer ${cs.customerId}`);
  checkEnum(`case study ${cs.id}`, "visibility", cs.visibility);
  cs.useCases.forEach((u) => checkEnum(`case study ${cs.id}`, "useCase", u));
}

// The deal assistant demo: every quote must come from the sample transcript,
// and every resource must link to something that exists.
const demo = load("transcript_demo.json");
const transcript = readFileSync(new URL(`../${demo.file.path}`, import.meta.url), "utf8");
const objections = load("battlecard_segment.json").objections;
const rank = (where, n, list) => {
  if (!Number.isInteger(n) || n < 1 || n > list.length) errors.push(`${where}: no rank ${n}`);
};
if (!competitors.has(demo.prospect.competitorId)) errors.push(`demo: unknown competitor ${demo.prospect.competitorId}`);
demo.prospect.personas.forEach((p) => checkEnum("demo prospect", "persona", p));
for (const c of demo.concerns) {
  if (!transcript.includes(c.quote)) errors.push(`demo concern "${c.concern}": quote not in transcript`);
  if (c.objection !== undefined && !objections[c.objection]) errors.push(`demo concern "${c.concern}": no objection ${c.objection}`);
}
for (const r of demo.resources) {
  const ok =
    r.kind === "caseStudy"
      ? caseStudyIds.has(r.ref)
      : r.kind === "reference"
        ? Boolean(customers.find((c) => c.id === r.ref)?.reference)
        : r.kind === "objection" && Boolean(objections[Number(r.ref)]);
  if (!ok) errors.push(`demo resource ${r.kind} ${r.ref}: not found`);
  r.addresses.forEach((n) => rank(`demo resource ${r.ref}`, n, demo.concerns));
}
demo.form.concerns.forEach((n) => rank("demo form concerns", n, demo.concerns));
demo.form.resources.forEach((n) => rank("demo form resources", n, demo.resources));
for (const n of demo.form.resources) {
  const r = demo.resources[n - 1];
  if (r && !r.addresses.some((c) => demo.form.concerns.includes(c))) errors.push(`demo form resource ${n}: answers no form concern`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`data ok: ${competitors.size - 1} competitors, ${sources.length} sources, ${signals.length} signals, ${customers.length} customers, ${caseStudies.length} case studies`);
