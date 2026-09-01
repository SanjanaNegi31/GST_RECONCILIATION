export type ReconcileStatus =
  | "matched"
  | "amount_mismatch"
  | "gstin_mismatch"
  | "missing_in_gstr2b"
  | "unreconciled";

export interface Invoice {
  id: string;
  vendor_name: string;
  vendor_gstin: string;
  invoice_number: string;
  invoice_date: string;
  taxable_amount: number;
  igst: number;
  cgst: number;
  sgst: number;
  total_amount: number;
  gstr2b_amount: number | null;
  status: ReconcileStatus;
  /** Set once the user edits a cell, so edited rows can be marked in the grid. */
  isEdited?: boolean;
}

export type StatusFilter = "all" | ReconcileStatus;

export interface Filters {
  /** Matches vendor name, invoice number or GSTIN. */
  search: string;
  status: StatusFilter;
  /** Inclusive ISO dates (YYYY-MM-DD); empty means unbounded. */
  dateFrom: string;
  dateTo: string;
}

export const EMPTY_FILTERS: Filters = {
  search: "",
  status: "all",
  dateFrom: "",
  dateTo: "",
};

/** Columns the user can edit inline. Both feed back into the row's status. */
export type EditableField = "taxable_amount" | "gstr2b_amount";
