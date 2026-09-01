import React from "react";
import { FileSpreadsheet } from "lucide-react";
import { useGstReconciliation } from "./hooks/useGstReconciliation";
import { GridToolbar } from "./components/grid-toolbar";
import { ReconciliationGrid } from "./components/reconciliation-grid";

const GstReconciliationLayout: React.FC = () => {
  const {
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
  } = useGstReconciliation();

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-6 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FileSpreadsheet className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                GST Reconciliation
              </h1>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                GSTR-2B vs Books
              </span>
            </div>
            {/* Sibling of the h1 rather than nested inside it - otherwise a
                screen reader announces this whole sentence as the heading. */}
            <p className="mt-0.5 truncate text-[13px] text-slate-500">
              Click a Taxable or GSTR-2B amount to edit it. Edited rows return to
              Unreconciled for review.
            </p>
          </div>
        </div>
      </header>

      {/* The grid takes whatever height is left, so the page itself never
          scrolls and the header can change size freely. */}
      <main className="mx-auto flex w-full min-h-0 max-w-[1600px] flex-1 flex-col gap-3 px-6 py-5">
          <GridToolbar
            filters={filters}
            setFilters={setFilters}
            isFiltered={isFiltered}
            onResetFilters={resetFilters}
            dateBounds={dateBounds}
            visibleCount={visibleInvoices.length}
            totalCount={invoices.length}
            selectedCount={selectedIds.size}
            onMarkReconciled={markSelectedReconciled}
            onClearSelection={clearSelection}
          />

          <ReconciliationGrid
            invoices={visibleInvoices}
            selectedIds={selectedIds}
            onToggleRow={toggleRow}
            onToggleAll={toggleAllVisible}
          onUpdateCell={updateCell}
        />
      </main>
    </div>
  );
};

export default GstReconciliationLayout;
