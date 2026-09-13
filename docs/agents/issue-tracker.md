# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` — never a single combined tickets file
- For ordinary issues, record triage state as a `Status:` line near the top of the file using the roles in `triage-labels.md`; use `needs-triage` when no triage outcome has been established. Wayfinder child tickets use the separate lifecycle below.
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Write specs to `.scratch/<feature-slug>/spec.md` and implementation tickets to `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, creating directories as needed. Number new tickets after the highest existing ticket number in that directory. For wayfinder maps and child tickets, use the paths below.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` — the Notes / Decisions-so-far / Fog body.
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`). Its `Status:` starts as `open`, changes to `claimed` before work, and becomes `resolved` when the answer is recorded. This field tracks wayfinder execution, not triage readiness; keep these lifecycle values when another skill works on a wayfinder child ticket.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for child tickets with `Status: open` whose blockers are all `resolved`; first by number wins. `claimed` and `resolved` tickets are outside the frontier.
- **Claim**: set `Status: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
