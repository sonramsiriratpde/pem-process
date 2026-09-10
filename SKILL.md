---
name: mermaid-swimlane-diagrams
description: >
  Use this skill whenever the person wants to create, edit, review, critique, or troubleshoot a
  Mermaid swimlane diagram for a business process, approval flow, or any workflow that crosses
  roles, teams, or systems — including Odoo 19 ERP processes (Sales, Purchase, Inventory,
  Manufacturing, Accounting/Invoicing, HR) for this project's BPR/RFP work. Trigger on requests
  like "draw a swimlane diagram for the quote-to-cash process", "review this mermaid diagram and
  tell me what's wrong with it", "map the PO approval flow across departments", "turn this
  process description into a diagram", "who owns this step in our onboarding flow", or any
  mention of swimlanes, cross-functional flowcharts, process-by-role diagrams, or BPR diagrams —
  even if the person just pastes raw Mermaid code with no further instructions. Covers two
  workflows — reviewing an existing diagram and suggesting concrete fixes, and building a new
  diagram from a process description.
---

# Mermaid Swimlane Diagrams

A swimlane diagram answers two questions at once: what happens, and who owns it. Each lane is one actor — a role, team, or system (a customer, the Sales team, the Odoo Inventory app) — and arrows show both the sequence of work and the handoffs between lanes. That's the whole point of this diagram type, so every decision below (which lanes to use, how to label an arrow, whether to split a diagram) should be judged against whether it keeps ownership and handoffs clear.

This project's diagrams are mostly going to represent Odoo 19 business processes for BPR/RFP work, so `references/odoo-process-patterns.md` has the standard out-of-the-box flow for the common Odoo apps — use it to keep stage names and sequencing accurate, then defer to whatever the person tells you about their actual configured process.

Full Mermaid syntax details (both the new `swimlane-beta` diagram type and the classic subgraph-based fallback) live in `references/mermaid-swimlane-syntax.md`. Read it before writing or editing diagram code — don't rely on memory for the exact syntax, since `swimlane-beta` is a very new addition (Mermaid v11.16+, June 2026-ish) and its syntax may still be evolving.

## Which syntax to use

Mermaid has a purpose-built `swimlane-beta` diagram type, but it's brand new and explicitly marked as subject to change, so support elsewhere is inconsistent. Before writing any diagram, get a sense of where it will actually be viewed and rendered:

- **Mermaid Chart / mermaid.ai, or a Mermaid.js ≥11.16 the person controls** → `swimlane-beta` is the better choice; it's purpose-built for this and reads cleaner.
- **GitHub/GitLab markdown, Notion, Confluence, a Word/PDF export, or anywhere the Mermaid version is unknown or likely older** → use the classic `flowchart` + `subgraph` pattern instead. It's been stable for years and renders everywhere.
- **Previewing inline in this chat** → try `swimlane-beta` first if that's genuinely the target syntax, but don't be surprised if the renderer here doesn't support it yet since it's so new — fall back to the classic pattern if the preview errors out or shows raw text. See "Previewing a diagram" below.

When in doubt, or when the destination isn't yet decided, default to the classic pattern — it costs nothing in readability and guarantees the person can actually use the diagram wherever they paste it. Both patterns are documented side by side in the reference file.

## Workflow 1: Review an existing diagram

1. **Get the code.** If it's not already in the conversation or an uploaded file, ask for it.
2. **Understand the intent** before critiquing syntax: what process is being modeled, who's the audience, and where will this diagram live (a slide, the RFP doc, a GitHub README)? This affects which syntax variant is right and how much detail belongs in the diagram.
3. **Check it against the ownership checklist:**
   - Does each lane represent exactly *one* kind of owner (a role, team, or system) — not a mix of teams and statuses in the same diagram?
   - Is every cross-lane arrow (a handoff) labeled with what's being handed off — a document, decision, or condition — rather than a bare arrow?
   - Are decisions placed in the lane that actually makes that decision, with outcomes routed out to the lanes that act on them?
   - Are node and lane ids short and stable, independent of their display labels?
   - Is the diagram readable in one pass, or is it trying to cram in an entire end-to-end process that should be split into two or three diagrams?
   - Does the direction (`TB` vs `LR`) fit the shape of the process — wide processes with few steps per lane often read better `LR`; deep processes with many sequential steps per lane often read better `TB`.
4. **Check syntax correctness** against `references/mermaid-swimlane-syntax.md` — mismatched brackets, undefined ids used in edges, `subgraph`/`end` imbalance, and confirm the syntax variant (`swimlane-beta` vs classic `flowchart`) is consistent throughout rather than mixed.
5. **If it models an Odoo process**, cross-check the stage names and sequence against `references/odoo-process-patterns.md`. Flag anything that doesn't match the standard flow — it might be a legitimate customization, or it might be a mistake, so ask rather than assume.
6. **Render it** (see "Previewing a diagram" below) so you're critiquing what actually gets drawn, not just the text.
7. Give specific, actionable feedback tied to the checklist above — not a generic "looks good" — and provide a corrected/improved version of the code alongside your reasoning for each change.

## Workflow 2: Create a new diagram

1. **Nail down the shape of the process** before writing any code: what are the lanes (who are the actors — people, teams, or systems), where does the process start and end, and where are the decision points? If the person's description leaves this ambiguous, ask concisely rather than guessing at a whole diagram structure — getting the lanes wrong means redoing the layout, not just tweaking a label.
2. **If it's an Odoo process**, check `references/odoo-process-patterns.md` for the standard stage sequence and terminology for that app first — this keeps node labels accurate to how Odoo actually works (e.g. "Quotation → Sales Order," not "Order → Confirmed Order"). Treat it as a starting vocabulary, not a rulebook: if the person describes a customized flow (an extra approval step, a merged stage), their description wins.
3. **Pick the syntax variant** per "Which syntax to use" above, asking where the diagram will live if it's not obvious.
4. **Draft the diagram**, then run it back through the ownership checklist in Workflow 1, step 3 — the same quality bar applies whether you're reviewing or creating.
5. **Preview it** (see below) before presenting it as final.
6. **Present the code** along with a short walkthrough of the flow, and invite adjustments — lane names and step granularity are the two things people most often want to tweak after seeing a first draft.

## Previewing a diagram

Don't just hand over code you haven't checked renders correctly.

- If a **Mermaid Chart connector** is available, that's the most reliable way to validate and render — it's purpose-built for Mermaid and will catch real syntax errors. It's a third-party app, so follow the normal connector flow (search, then let the person choose it) rather than calling it unprompted, unless they've already named or picked it in this conversation.
- Otherwise, when working with file/artifact tools, a file saved with a `.mermaid` extension renders inline as a diagram. Because `swimlane-beta` is so new, this may or may not be supported yet — if the preview errors or just shows raw text, switch to the classic `flowchart`/`subgraph` pattern and re-render.
- If neither is available, present the code in a fenced ```mermaid block and say plainly that you weren't able to render a preview, so the person knows to check it themselves before using it.

## Reference files

- `references/mermaid-swimlane-syntax.md` — full syntax for both `swimlane-beta` and the classic `flowchart`/`subgraph` pattern: lanes, node shapes, edge types, direction, accessibility, and the underlying good-practice rules this skill's checklist is built on.
- `references/odoo-process-patterns.md` — standard out-of-the-box process flows and lane/actor suggestions for the common Odoo 19 apps (Sales, Purchase, Inventory, Manufacturing, Accounting/Invoicing, HR), for grounding Odoo-related diagrams in accurate terminology.
