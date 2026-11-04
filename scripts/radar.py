#!/usr/bin/env python3
"""Competitive Radar pipeline: snapshot -> diff -> classify -> signals.

How the real version runs each week:
  1. Fetch every public source in data/sources.json.
  2. Save a dated snapshot.
  3. Diff it against the previous snapshot and drop cosmetic changes.
  4. Send each meaningful diff to Claude, which classifies and drafts the
     signal in the same shape as data/signals.json.
  5. Write the drafts to samples/output/ for human review. Nothing reaches
     data/signals.json (and so the site) until a person approves it.

The demo runs steps 3-5 against the before/after pairs in samples/snapshots/.

Usage:
  python scripts/radar.py --dry-run     # diff only, print what would be sent
  python scripts/radar.py               # diff + classify with the Claude API
  python scripts/radar.py --live        # also fetch sources with real URLs
"""

from __future__ import annotations

import argparse
import datetime as dt
import difflib
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
SNAPSHOTS = ROOT / "samples" / "snapshots"
OUTPUT = ROOT / "samples" / "output"

MODEL = "claude-opus-5-5"

DATE = re.compile(
    r"\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}"
)
# A changed line that differs by this many words or fewer (after ignoring
# dates and punctuation) is cosmetic. Matches lib/diff.ts so the site's diff
# demo and the pipeline agree.
COSMETIC_MAX_WORDS = 2


def load(name: str):
    return json.loads((DATA / name).read_text())


# --- Step 1-2: fetch and snapshot ------------------------------------------


def fetch_snapshot(source: dict, today: str) -> Path | None:
    """Fetch a source and save it as a dated snapshot. Placeholder URLs are skipped."""
    url = source["url"]
    if not url.startswith("http"):
        return None
    folder = SNAPSHOTS / "live" / source["id"]
    folder.mkdir(parents=True, exist_ok=True)
    request = urllib.request.Request(url, headers={"User-Agent": "competitive-radar/0.1"})
    with urllib.request.urlopen(request, timeout=30) as response:
        html = response.read().decode("utf-8", errors="replace")
    # Keep text only. A production version would use a readability extractor.
    text = re.sub(r"<script.*?</script>|<style.*?</style>", "", html, flags=re.S)
    text = re.sub(r"<[^>]+>", "\n", text)
    text = "\n".join(line.strip() for line in text.splitlines() if line.strip())
    path = folder / f"{today}.md"
    path.write_text(text)
    return path


def snapshot_pair(source: dict) -> tuple[str, str] | None:
    """Return (before, after) text for a source, newest two snapshots."""
    if source.get("snapshot"):
        base = SNAPSHOTS / source["snapshot"]
        return (base.with_suffix(".before.md").read_text(), base.with_suffix(".after.md").read_text())
    live = sorted((SNAPSHOTS / "live" / source["id"]).glob("*.md"))
    if len(live) >= 2:
        return live[-2].read_text(), live[-1].read_text()
    return None


# --- Step 3: change detection ------------------------------------------------


def words(line: str) -> list[str]:
    line = DATE.sub("<date>", line)
    line = re.sub(r"[.,;:!?]+(\s|$)", r"\1", line)
    return line.split()


def word_distance(a: list[str], b: list[str]) -> int:
    matcher = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    return sum(
        max(i2 - i1, j2 - j1) for tag, i1, i2, j1, j2 in matcher.get_opcodes() if tag != "equal"
    )


def section_of(lines: list[str], index: int) -> str:
    """The nearest markdown heading above a line, so a moved line keeps its context."""
    for line in reversed(lines[:index]):
        if line.startswith("#"):
            return line.lstrip("#").strip()
    return ""


def meaningful_diff(before: str, after: str) -> list[str]:
    """Unified-style lines (+/-) for changes that aren't cosmetic, tagged with their section."""
    a, b = before.rstrip().splitlines(), after.rstrip().splitlines()

    def marked(sign: str, lines: list[str], index: int) -> str:
        section = section_of(lines, index)
        return f"{sign} {lines[index]}" + (f"   [section: {section}]" if section else "")

    changes: list[str] = []
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=a, b=b, autojunk=False).get_opcodes():
        if tag == "equal":
            continue
        dels, adds = a[i1:i2], b[j1:j2]
        cosmetic = set()
        for k in range(min(len(dels), len(adds))):
            if word_distance(words(dels[k]), words(adds[k])) <= COSMETIC_MAX_WORDS:
                cosmetic.add(k)
        changes += [marked("-", a, i1 + k) for k, line in enumerate(dels) if k not in cosmetic and line.strip()]
        changes += [marked("+", b, j1 + k) for k, line in enumerate(adds) if k not in cosmetic and line.strip()]
    return changes


# --- Step 4: classify and score -----------------------------------------------


def signal_schema(signal_types: list[dict], rules: dict) -> dict:
    personas = [p["id"] for p in rules["personas"]]
    confidence = [c["id"] for c in rules["confidence"]]
    owners = ["Sales", "Sales leadership", "PMM", "Product", "Website", "CS", "Enablement"]
    return {
        "type": "object",
        "properties": {
            "type": {"type": "string", "enum": [t["id"] for t in signal_types]},
            "change": {"type": "string"},
            "whyItMatters": {"type": "string"},
            "whatToSay": {"type": "string"},
            "personas": {"type": "array", "items": {"type": "string", "enum": personas}},
            "impact": {"type": "integer", "enum": [1, 2, 3, 4, 5]},
            "confidence": {"type": "string", "enum": confidence},
            "owners": {"type": "array", "items": {"type": "string", "enum": owners}},
        },
        "required": ["type", "change", "whyItMatters", "whatToSay", "personas", "impact", "confidence", "owners"],
        "additionalProperties": False,
    }


def system_prompt(signal_types: list[dict], rules: dict) -> str:
    types = "\n".join(f"- {t['id']}: {t['label']}. {t['description']}" for t in signal_types)
    impact = "\n".join(f"- {d['score']}: {d['label']}" for d in rules["dealImpact"])
    personas = "\n".join(f"- {p['id']}: {p['needs']}" for p in rules["personas"])
    confidence = "\n".join(f"- {c['id']}: {c['when']}" for c in rules["confidence"])
    routing = "\n".join(f"- {r['when']} -> {' + '.join(r['to'])}" for r in rules["routing"])
    return f"""You draft competitive intelligence signals for Housecall Pro's sales team.
Housecall Pro sells field service software to home service businesses (plumbing, HVAC,
electrical, cleaning, lawn care, and more): scheduling, dispatch, invoicing, payments,
financing, and marketing. Its main competitors are Jobber and ServiceTitan.

You get one competitor source and the lines that changed since the last snapshot.
Turn the change into one signal a sales rep can use. A product marketer reviews every
draft before anyone sees it.

Signal types:
{types}

Deal impact (does this change what a rep says in an active deal?):
{impact}

Personas:
{personas}

Confidence:
{confidence}

Routing (use it to choose owners):
{routing}

Writing rules:
- change: one sentence, starting with the competitor name, saying what changed.
- whyItMatters: one or two sentences on the effect on Housecall Pro deals.
- whatToSay: a line a rep can say or a question to ask, in quotes. If reps shouldn't
  act on it, say so plainly.
- Plain, direct sentences. No hype words.
- Use only facts present in the diff. Never invent prices, numbers, quotes, or
  customer names. If the diff doesn't support a claim, leave the claim out."""


def classify(client, source: dict, competitor: str, diff: list[str], schema: dict, system: str) -> dict:
    prompt = (
        f"Competitor: {competitor}\n"
        f"Source: {source['type']} ({source['url']})\n"
        f"What we watch this source for: {source['lookFor']}\n\n"
        "Changed lines (- removed, + added):\n" + "\n".join(diff)
    )
    response = client.beta.messages.create(
        model=MODEL,
        max_tokens=16000,
        system=system,
        messages=[{"role": "user", "content": prompt}],
        # effort: classification doesn't need deep reasoning.
        output_config={"effort": "medium", "format": {"type": "json_schema", "schema": schema}},
        # If a safety classifier declines, retry on Anthropic's recommended fallback model.
        betas=["server-side-fallback-2026-07-01"],
        extra_body={"fallbacks": "default"},
    )
    if response.stop_reason == "refusal":
        raise RuntimeError(f"declined: {getattr(response.stop_details, 'category', None)}")
    if response.stop_reason == "max_tokens":
        raise RuntimeError("response hit max_tokens before finishing")
    text = next(block.text for block in response.content if block.type == "text")
    return json.loads(text)


def urgency_for(impact: int, confidence: str) -> str:
    """Apply the urgency rules from rules.json in code, so they're never left to the model."""
    if impact >= 4 and confidence in ("Confirmed", "Likely"):
        return "Alert now"
    if impact >= 3:
        return "This week's digest"
    return "Monthly review"


def snapshot_date(after: str, fallback: str) -> str:
    found = re.search(r"\d{4}-\d{2}-\d{2}", after.splitlines()[0] if after else "")
    return found.group(0) if found else fallback


def week_of(iso: str) -> str:
    day = dt.date.fromisoformat(iso)
    return (day - dt.timedelta(days=day.weekday())).isoformat()


# --- Run ----------------------------------------------------------------------


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true", help="diff only; don't call the API")
    parser.add_argument("--live", action="store_true", help="fetch sources that have real URLs first")
    args = parser.parse_args()

    sources = load("sources.json")
    competitors = {c["id"]: c["name"] for c in load("competitors.json")}
    signal_types = load("signal_types.json")
    rules = load("rules.json")
    next_id = max(s["id"] for s in load("signals.json")) + 1
    today = dt.date.today().isoformat()

    if args.live:
        for source in sources:
            if not source["internal"] and fetch_snapshot(source, today):
                print(f"fetched {source['id']}")

    client = None
    if not args.dry_run:
        import anthropic  # imported here so --dry-run works without the SDK installed

        client = anthropic.Anthropic()
    schema = signal_schema(signal_types, rules)
    system = system_prompt(signal_types, rules)

    drafts = []
    for source in sources:
        pair = snapshot_pair(source)
        if not pair:
            continue
        diff = meaningful_diff(*pair)
        name = competitors.get(source["competitorId"], source["competitorId"])
        if not diff:
            print(f"{source['id']}: only cosmetic changes, skipped")
            continue
        print(f"\n{source['id']}: {len(diff)} meaningful line(s)")
        print("\n".join(f"    {line}" for line in diff))
        if client is None:
            continue

        try:
            fields = classify(client, source, name, diff, schema, system)
        except Exception as error:  # one bad source shouldn't stop the run
            print(f"    classification failed: {error}", file=sys.stderr)
            continue

        date = snapshot_date(pair[1], today)
        signal = {
            "id": next_id,
            "weekOf": week_of(date),
            "date": date,
            "competitorId": source["competitorId"],
            "sourceId": source["id"],
            **fields,
            "urgency": urgency_for(fields["impact"], fields["confidence"]),
            # Every draft starts in review. A person approves it before it moves to data/signals.json.
            "status": "In review",
        }
        next_id += 1
        drafts.append(signal)
        print(f"    -> #{signal['id']} {signal['type']} · impact {signal['impact']} · {signal['urgency']}")
        print(f"       {signal['change']}")

    if drafts:
        OUTPUT.mkdir(parents=True, exist_ok=True)
        path = OUTPUT / "signals.generated.json"
        path.write_text(json.dumps(drafts, indent=2, ensure_ascii=False) + "\n")
        print(f"\n{len(drafts)} draft signal(s) written to {path.relative_to(ROOT)} for review.")
    elif client is None:
        print("\nDry run: nothing sent to the API.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
