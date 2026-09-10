# Mermaid swimlane syntax reference

Source: https://mermaid.ai/open-source/syntax/swimlanes.html (Mermaid's own docs — check there directly if something below seems out of date, since this diagram type is new and still evolving).

There are two ways to draw a swimlane-style diagram in Mermaid. Pick per the "Which syntax to use" section of SKILL.md.

## Option A: `swimlane-beta` (Mermaid v11.16+)

Purpose-built diagram type. Marked as beta — syntax may still change in future Mermaid releases.

### Starting a diagram

```
swimlane-beta
```

Optionally add a direction right after the keyword:

```
swimlane-beta LR
```

| Direction | Meaning                |
| --------- | ---------------------- |
| `TB`      | Top to bottom (default if omitted) |
| `TD`      | Top down, same as `TB` |
| `BT`      | Bottom to top          |
| `LR`      | Left to right          |
| `RL`      | Right to left          |

### Lanes

Each top-level `subgraph ... end` block becomes one swimlane. Give it a plain label, or an id plus a label when the label has spaces or you want a stable id to attach styles/references to:

```
swimlane-beta LR
  subgraph Sales
    quote[Prepare Quotation]
  end
  subgraph wh["Warehouse"]
    pick[Pick & Pack]
  end
```

### Nodes

Nodes use the same shape syntax as flowcharts — id first, label inside the shape delimiters:

| Syntax        | Shape             | Typical use          |
| ------------- | ----------------- | --------------------- |
| `id[Text]`    | Rectangle          | Task or activity      |
| `id(Text)`    | Rounded rectangle  | Step or event         |
| `id([Text])`  | Stadium            | Start or end point    |
| `id{Text}`    | Decision           | Branching question     |
| `id((Text))`  | Circle             | Connector or marker   |

(Full shape catalog, icons, images, markdown-string labels, classes, and styling: see Mermaid's flowchart syntax docs — same rules apply here.)

### Edges

Also flowchart-style, and they can connect nodes within a lane or across lanes:

| Syntax             | Meaning                 |
| ------------------ | ------------------------ |
| `A --> B`           | Arrow                    |
| `A --- B`           | Line, no arrowhead        |
| `A -->|Label| B`    | Arrow with a label        |
| `A -.-> B`          | Dotted arrow              |
| `A ==> B`           | Thick arrow                |

### Accessibility

```
swimlane-beta
  accTitle: Quote to cash process
  accDescr: Shows the handoffs between Sales, Warehouse, and Accounting from quotation to payment.
  ...
```

### Worked example

```
swimlane-beta LR
  subgraph Customer
    start([Request Quote])
    pay([Pay Invoice])
  end
  subgraph Sales
    quote[Prepare Quotation]
    approve{Approved by Customer?}
  end
  subgraph Warehouse
    deliver[Pick, Pack & Deliver]
  end
  subgraph Accounting
    invoice[Issue Invoice]
  end

  start --> quote
  quote --> approve
  approve -->|Revise| quote
  approve -->|Confirmed| deliver
  deliver -->|Delivery Confirmed| invoice
  invoice --> pay
```

## Option B: classic `flowchart` + `subgraph` (works everywhere)

Same idea, using the long-stable flowchart syntax. This is the safe default when you don't know the target renderer, or when the target is GitHub/GitLab markdown, Notion, Confluence, or an older Mermaid version.

```
flowchart LR
  subgraph Customer
    start([Request Quote])
    pay([Pay Invoice])
  end
  subgraph Sales
    quote[Prepare Quotation]
    approve{Approved by Customer?}
  end
  subgraph Warehouse
    deliver[Pick, Pack & Deliver]
  end
  subgraph Accounting
    invoice[Issue Invoice]
  end

  start --> quote
  quote --> approve
  approve -->|Revise| quote
  approve -->|Confirmed| deliver
  deliver -->|Delivery Confirmed| invoice
  invoice --> pay
```

Everything else — node shapes, edge syntax, direction keywords — is identical to Option A, since `swimlane-beta` reuses flowchart conventions. The only real differences are the opening keyword (`flowchart LR` vs `swimlane-beta LR`) and that classic Mermaid doesn't guarantee lanes render as strict aligned rows the way the purpose-built type does — layout can drift on complex diagrams. If strict lane alignment matters and the renderer supports it, prefer Option A.

## Good practices (why the review checklist looks the way it does)

These come straight from Mermaid's own guidance and are the basis for the checklist in SKILL.md:

- **One kind of ownership per lane.** Don't mix teams, phases, and statuses as lanes in the same diagram unless that mixing is deliberately the point.
- **Label cross-lane handoffs.** A cross-lane arrow is where responsibility changes hands — label it with the document, decision, message, or condition that triggers the handoff.
- **Keep it readable.** Split a large process into several diagrams once lanes or handoffs stop fitting in one view. If you have to trace an arrow twice to follow it, it's too dense.
- **Use stable ids.** Short, meaningful node/lane ids that don't change even if the display label is edited later.
- **Put decisions where they're made.** A decision node belongs in the lane that owns that decision; route the outcomes to whichever lanes act on the result.

## When *not* to use a swimlane diagram

- Ownership isn't the point, only sequence/branching matters → plain `flowchart`.
- The focus is messages over time between participants → `sequenceDiagram`.
- The focus is how one entity changes state → `stateDiagram`.
