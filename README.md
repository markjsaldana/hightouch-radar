# Deal Radar

A proposal for a sales enablement assistant that SDRs and AEs can rely on at every stage of the deal, from prospecting to renewal. It answers from current competitive intel, battlecards, and customer references, and cites a source for every line. The site shows the system behind it, what reps receive, and how Hightouch could build it internally, on its own or with me.

**Sample data for illustration. Not real competitive claims.** Company names give category context. Ownership facts in `data/competitors.json` are public and sourced. Every event, rating, and talk track is invented.

## Run locally

```bash
npm install
npm run dev
```

## Data

Everything the UI shows comes from JSON in `/data`, so swapping sample data for real data never touches the UI.

| File | What it holds |
| --- | --- |
| `competitors.json` | Competitors, tiers, personas, "why they win" hypotheses, sourced facts |
| `sources.json` | What gets monitored, how often, and what we look for |
| `signal_types.json` | The nine kinds of change the Radar classifies |
| `rules.json` | Deal-impact scoring, urgency, confidence, routing table |
| `signals.json` | Scored signals across three weeks |
| `digest.json` | This week's top-3, trends, and win-loss questions |
| `battlecard_segment.json` | Sample battlecard |
| `matrix.json` | Capability matrix and positioning map |
| `routing_log.json` | Where intel went, plus the KPI scorecard |
| `customers.json` | Customers, with reference details (contact role, status, formats) for those who take calls |
| `case_studies.json` | Case studies for reference customers and others, public or internal only |
| `transcript_demo.json` | What the deal assistant demo extracts from the sample call transcript |

`samples/snapshots/` holds before/after source snapshots that power the diff demo. `samples/transcripts/` holds the sample call transcript behind the deal assistant demo; `check:data` confirms every quoted line appears in it.

Run `npm run check:data` after editing data. It validates enum fields and every cross-file reference.

## Deploy

Import the repo in Vercel (framework preset: Next.js). The site is `noindex` and blocked in `robots.txt`, so it's shared by link only.

## The pipeline (`scripts/radar.py`)

The site shows the Radar's output. `scripts/radar.py` shows how the output gets made:

1. **Fetch** each public source in `data/sources.json` (`--live`; sources with placeholder URLs are skipped).
2. **Snapshot** it to a dated file.
3. **Diff** against the previous snapshot. Date stamps and edits of 2 words or fewer are dropped as cosmetic, the same rule the site's diff demo uses. Each changed line keeps its section heading, so "moved from Add-ons to Starter" survives the diff.
4. **Classify** each meaningful diff with the Claude API. A JSON schema built from `signal_types.json` and `rules.json` makes the response match the `signals.json` shape exactly. Urgency is computed in code from the rules, not by the model.
5. **Write drafts** to `samples/output/signals.generated.json` with status "In review". A person checks every draft before it moves into `data/signals.json` and onto the site.

```bash
python3 scripts/radar.py --dry-run          # diff the sample snapshots, no API call
pip install -r scripts/requirements.txt
export ANTHROPIC_API_KEY=...                # or `ant auth login`
python3 scripts/radar.py                    # diff + classify the sample snapshots
```

### Running it weekly

In production this runs on a schedule, for example a GitHub Actions cron early every Monday, before the digest goes out:

```yaml
on:
  schedule:
    - cron: "0 13 * * 1"   # Mondays 13:00 UTC (5 or 6am Pacific)
jobs:
  radar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r scripts/requirements.txt
      - run: python3 scripts/radar.py --live
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      # Open a PR with the drafts. Approving and merging it is the human review step.
      - uses: peter-evans/create-pull-request@v6
        with:
          title: "Radar drafts for review"
          add-paths: samples/output/
```

Pricing pages would get a second, daily job. Internal sources (win-loss notes, Gong mentions) come from their own exports and go through the same classify-and-review step.
