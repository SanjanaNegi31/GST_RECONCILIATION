# GST Reconciliation Grid

An editable grid of 1,000 mock purchase invoices reconciled against GSTR-2B.
React 19 + TypeScript + Vite + Tailwind v4, with shadcn/ui components.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build
```

## Where things are

```
src/feature/gst-reconciliation/
  hooks/useGstReconciliation.ts    all state: invoices, selection, filters
  components/reconciliation-grid   the virtualized table
  components/grid-toolbar          search, status dropdown, date range
  mock/mockData.ts                 5 sample invoices -> 1,000 rows
src/components/ui/                 shadcn primitives
```

## What it does

| Feature | Notes |
| --- | --- |
| 1,000 rows | Grown from the 5 sample invoices. Deterministic, so every reload is identical. |
| Smooth scrolling | `@tanstack/react-virtual` mounts only the on-screen rows. |
| Inline editing | Taxable and GSTR-2B. Enter or blur saves, Esc cancels. Editing Taxable recalculates IGST/CGST/SGST and Total. |
| Status colours | Only problem rows are tinted, so the grid isn't a wall of colour. Plus a badge and a Diff column (Total − GSTR-2B). |
| Row selection | Click, shift-click for a range, or select all. |
| Bulk action | Mark selected rows as reconciled. |
| Filtering *(the nice-to-have)* | Search, status dropdown and date range, all combining. |

Editing a row sets it back to **Unreconciled** rather than silently re-deciding
the match — the brief's "default for newly-edited rows". So the flow is
edit → review → select → mark reconciled, which gives the bulk action a real job.

## Why these libraries

- **shadcn/ui** — copied into `src/components/ui/` rather than wrapped, so it's
  editable in place.
- **`@tanstack/react-virtual`, not AG Grid** — the only hard problem at this size
  is not mounting 1,000 rows, and that's ~15 lines. Rows stay real `<tr>`s, so
  the browser still sizes the columns and widths can be percentages rather than
  fixed pixels.
- **No state library** — one hook, one consumer.
- **Dates as ISO strings** — range filtering becomes a string comparison, and
  avoids `toISOString()` shifting the day for anyone off UTC.

## With more time

1. **Undo** — bulk-reconciling 200 rows by mistake is currently unrecoverable.
2. **Sortable columns**, especially Diff, to surface the biggest gaps.
3. **Measured row heights** instead of a fixed 44px, so long names can wrap.

## AI tools

Claude Code did the mechanical work: stripping an over-built earlier version back
to the brief, converting a hand-rolled div grid to the shadcn table, and wiring
up the filter bar. I reviewed its output, which caught real bugs — a `??` that
never fell back on an empty string, and cells overflowing into their neighbours.
The product calls were mine.

