import type { ReconcileStatus } from "@/feature/gst-reconciliation/types/gst";

/**
 * Colour coding per reconciliation status. `row` tints the whole row so
 * problems are visible while scrolling; matched rows stay white so the grid
 * doesn't read as a wall of colour. `short` is the in-table badge, which has
 * less room than the filter tabs.
 */
export const STATUS_META: Record<
  ReconcileStatus,
  { label: string; short: string; row: string; badge: string }
> = {
  matched: {
    label: "Matched",
    short: "Matched",
    row: "bg-white hover:bg-slate-50",
    badge: "bg-green-100 text-green-800",
  },
  amount_mismatch: {
    label: "Amount mismatch",
    short: "Amount diff",
    row: "bg-amber-50 hover:bg-amber-100",
    badge: "bg-amber-100 text-amber-800",
  },
  gstin_mismatch: {
    label: "GSTIN mismatch",
    short: "GSTIN diff",
    row: "bg-amber-50 hover:bg-amber-100",
    badge: "bg-amber-100 text-amber-800",
  },
  missing_in_gstr2b: {
    label: "Missing in GSTR-2B",
    short: "Not in 2B",
    row: "bg-red-50 hover:bg-red-100",
    badge: "bg-red-100 text-red-800",
  },
  unreconciled: {
    label: "Unreconciled",
    short: "Unreconciled",
    row: "bg-slate-50 hover:bg-slate-100",
    badge: "bg-slate-200 text-slate-700",
  },
};

export const STATUS_ORDER: ReconcileStatus[] = [
  "matched",
  "amount_mismatch",
  "gstin_mismatch",
  "missing_in_gstr2b",
  "unreconciled",
];
