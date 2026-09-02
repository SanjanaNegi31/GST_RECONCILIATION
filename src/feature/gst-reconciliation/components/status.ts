import type { ReconcileStatus } from "@/feature/gst-reconciliation/types/gst";

/**
 * Colour coding per reconciliation status designed for senior B2B SaaS applications.
 * Tints whole rows subtly so discrepancies stand out during fast virtualized scrolling.
 * Badges use clear border contrast and readable font sizes.
 */
export const STATUS_META: Record<
  ReconcileStatus,
  { label: string; short: string; row: string; badge: string }
> = {
  matched: {
    label: "Matched",
    short: "Matched",
    row: "bg-white hover:bg-emerald-50/30",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium",
  },
  amount_mismatch: {
    label: "Amount mismatch",
    short: "Amount diff",
    row: "bg-amber-50/40 hover:bg-amber-50/80",
    badge: "bg-amber-50 text-amber-800 border border-amber-200/80 font-medium",
  },
  gstin_mismatch: {
    label: "GSTIN mismatch",
    short: "GSTIN diff",
    row: "bg-orange-50/40 hover:bg-orange-50/80",
    badge: "bg-orange-50 text-orange-800 border border-orange-200/80 font-medium",
  },
  missing_in_gstr2b: {
    label: "Missing in GSTR-2B",
    short: "Not in 2B",
    row: "bg-rose-50/40 hover:bg-rose-50/80",
    badge: "bg-rose-50 text-rose-700 border border-rose-200/80 font-medium",
  },
  unreconciled: {
    label: "Unreconciled",
    short: "Unreconciled",
    row: "bg-slate-50/60 hover:bg-slate-100/60",
    badge: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
  },
};

export const STATUS_ORDER: ReconcileStatus[] = [
  "matched",
  "amount_mismatch",
  "gstin_mismatch",
  "missing_in_gstr2b",
  "unreconciled",
];
