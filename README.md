# GST Reconciliation Grid

An editable grid of 1,000 mock purchase invoices reconciled against GSTR-2B.

```bash
npm install
npm run dev
```

## What's implemented

- **1,000 rows**, expanded programmatically from the 5 sample invoices in
  `src/feature/gst-reconciliation/mock/mockData.ts` (deterministic, no RNG).
- **Virtualized scrolling** via `@tanstack/react-virtual` — about 17 rows are in
  the DOM at any time regardless of list length.
- **Inline editing** on Taxable and GSTR-2B amounts. Click, Enter or blur to
  save, Escape to cancel. Editing Taxable recalculates IGST/CGST/SGST and Total.
- **Colour coding** by status. Matched rows stay white and only problems are
  tinted, so the grid doesn't read as a wall of colour; every row also carries a
  status badge and a Diff column showing Total − GSTR-2B.
- **Row selection**, single click and shift-click for a range, plus select-all.
- **Bulk action**: mark the selected rows reconciled.
- **Nice-to-have — filtering**: search across vendor / invoice number / GSTIN, a
  status dropdown, and an invoice-date range picker. All three compose, and
  Reset Filters clears them.

Editing a row sets it back to `unreconciled` rather than silently re-deciding
the match, per the brief's "default for newly-edited rows". That makes the flow
edit → review → select → mark reconciled, which is what the bulk action is for.

## Choices

**shadcn/ui** for the table, plus its Calendar (react-day-picker), Select and
Popover for the filter bar — copied into `src/components/ui/` rather than
wrapped, which is how shadcn is meant to be used, so they're editable in place.

**`@tanstack/react-virtual` + shadcn/ui table** rather than a full grid suite
(AG Grid, MUI DataGrid). At this scope the only hard problem is not mounting
1,000 rows, and that's ~15 lines of virtualizer. Rows stay real `<tr>`s with
spacer rows above and below rather than absolutely-positioned divs, so the
browser's table layout still sizes the columns — that's what lets the columns be
percentage-based and responsive instead of hard-coded pixel widths.

**State lives in one hook**, `useGstReconciliation`, holding the invoice array,
a `Set` of selected ids and the filter object. No state library: there's one
consumer, so context or Zustand would be indirection without a payoff.

**Dates are stored as ISO strings** (`YYYY-MM-DD`), which makes the range filter
an ordinary string comparison — no parsing per row, and no timezone bug from
`toISOString` shifting the day. The calendar opens on the data's own date range
rather than today, so it isn't showing an empty month on arrival.

## What I'd improve with more time

1. **Undo** for edits and bulk actions — an accountant who bulk-reconciles 200
   rows by mistake currently has no way back.
2. **Sortable columns**, particularly by Diff, so the largest discrepancies come
   to the top instead of having to be scrolled for.
3. **Virtualize with measured row heights** instead of a fixed 36px, so a long
   vendor name can wrap without breaking scroll position maths.

## AI tools

Used Claude Code to strip an earlier over-built version of this UI back to the
brief (removing KPI cards, a scaling-note modal, CSV export and two extra bulk
actions), to convert the hand-rolled div grid to the shadcn table with
responsive columns, and to review the reconciliation logic. I made the calls on
what to cut and what the edit-then-review flow should be.

## Scaling to 50,000 rows (SDE 2)

**The bottleneck is not rendering — virtualization already handles it.** It's
that every piece of state here is a flat array walked on each change:
`visibleInvoices` filters all 50,000 on any filter change, and `updateCell`
does a full `map` producing 50,000 new references on every keystroke-committed
edit. At 1,000 rows that's sub-millisecond; at 50,000 it's a visible stall on
each edit.

What I'd change:

1. **Normalize to `Map<string, Invoice>`** so an edit touches one key instead of
   rebuilding the array, and keep a separate array of ids for order.
2. **Keep a status index** (`Map<status, id[]>`) maintained incrementally, so
   status filtering is a lookup rather than a 50,000-element scan, and
   **debounce the search box** — right now every keystroke re-scans the list,
   which is free at 1,000 rows and is not at 50,000.
3. **Memoize the row** with `React.memo` on a stable-identity row so an edit
   re-renders one row, not every mounted row.
4. **Move to server-side paging/filtering** past a few hundred thousand rows —
   at that point the real limits are transfer size and memory, not React, and
   the client shouldn't hold the whole set at all.

Selection is already a `Set`, so it's O(1) and doesn't need changing.
