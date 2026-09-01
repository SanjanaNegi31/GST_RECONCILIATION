import { useState, useMemo, useCallback } from "react";
import type { Invoice, EditableField, Filters } from "@/feature/gst-reconciliation/types/gst";
import { EMPTY_FILTERS } from "@/feature/gst-reconciliation/types/gst";
import { generateMockInvoices } from "@/feature/gst-reconciliation/mock/mockData";

export function useGstReconciliation() {
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    generateMockInvoices(1000)
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const visibleInvoices = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    // Dates are stored as ISO (YYYY-MM-DD), so a string compare is a date
    // compare - no parsing needed.
    return invoices.filter((inv) => {
      if (filters.status !== "all" && inv.status !== filters.status)
        return false;
      if (filters.dateFrom && inv.invoice_date < filters.dateFrom) return false;
      if (filters.dateTo && inv.invoice_date > filters.dateTo) return false;

      if (query) {
        const haystack = `${inv.vendor_name} ${inv.invoice_number} ${inv.vendor_gstin}`;
        if (!haystack.toLowerCase().includes(query)) return false;
      }

      return true;
    });
  }, [invoices, filters]);

  const isFiltered =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  /** Earliest and latest invoice dates, so the calendar can open on the data
   *  and refuse days that could only ever return nothing. */
  const dateBounds = useMemo(() => {
    let min = invoices[0]?.invoice_date ?? "";
    let max = min;
    for (const inv of invoices) {
      if (inv.invoice_date < min) min = inv.invoice_date;
      if (inv.invoice_date > max) max = inv.invoice_date;
    }
    return { min, max };
  }, [invoices]);

  /**
   * Applies an inline edit. Editing invalidates whatever the importer decided
   * about this row, so it drops back to "unreconciled" for a human to confirm
   * - that's what the bulk action is for.
   */
  const updateCell = useCallback(
    (id: string, field: EditableField, rawValue: string | number) => {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== id) return inv;

          const updated: Invoice = {
            ...inv,
            status: "unreconciled",
            isEdited: true,
          };

          if (field === "taxable_amount") {
            updated.taxable_amount = Math.max(0, Number(rawValue) || 0);

            // Keep the existing tax treatment: inter-state rows carry IGST,
            // intra-state rows split the same 18% into CGST + SGST.
            if (inv.igst > 0) {
              updated.igst = Math.round(updated.taxable_amount * 0.18);
            } else {
              updated.cgst = Math.round(updated.taxable_amount * 0.09);
              updated.sgst = Math.round(updated.taxable_amount * 0.09);
            }

            updated.total_amount =
              updated.taxable_amount + updated.igst + updated.cgst + updated.sgst;
          } else {
            updated.gstr2b_amount =
              rawValue === "" ? null : Math.max(0, Number(rawValue) || 0);
          }

          return updated;
        })
      );
    },
    []
  );

  /** Click toggles one row; shift-click extends the range from the last click. */
  const toggleRow = useCallback(
    (id: string, isShiftKey: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);

        if (isShiftKey && lastSelectedId) {
          const from = visibleInvoices.findIndex((i) => i.id === lastSelectedId);
          const to = visibleInvoices.findIndex((i) => i.id === id);

          if (from !== -1 && to !== -1) {
            const [start, end] = from < to ? [from, to] : [to, from];
            visibleInvoices
              .slice(start, end + 1)
              .forEach((inv) => next.add(inv.id));
            return next;
          }
        }

        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

      setLastSelectedId(id);
    },
    [visibleInvoices, lastSelectedId]
  );

  const toggleAllVisible = useCallback(() => {
    setSelectedIds((prev) => {
      const allSelected = visibleInvoices.every((inv) => prev.has(inv.id));
      const next = new Set(prev);
      visibleInvoices.forEach((inv) =>
        allSelected ? next.delete(inv.id) : next.add(inv.id)
      );
      return next;
    });
  }, [visibleInvoices]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedId(null);
  }, []);

  /** Bulk action: accept our figures for the selected rows as reconciled. */
  const markSelectedReconciled = useCallback(() => {
    if (selectedIds.size === 0) return;

    setInvoices((prev) =>
      prev.map((inv) =>
        selectedIds.has(inv.id)
          ? {
              ...inv,
              status: "matched",
              gstr2b_amount: inv.total_amount,
              isEdited: true,
            }
          : inv
      )
    );
    clearSelection();
  }, [selectedIds, clearSelection]);

  return {
    invoices,
    visibleInvoices,
    selectedIds,
    filters,
    setFilters,
    isFiltered,
    resetFilters,
    dateBounds,
    updateCell,
    toggleRow,
    toggleAllVisible,
    clearSelection,
    markSelectedReconciled,
  };
}
