import React from "react";
import { useGstReconciliation } from "./hooks/useGstReconciliation";
import { GridToolbar } from "./components/grid-toolbar";
import { ReconciliationGrid } from "./components/reconciliation-grid";
import { MastersIndiaLogo } from "../../assets/masters-india-logo";

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
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header with Masters India Logo & Branding */}
      <header className="shrink-0 border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-4">
            <MastersIndiaLogo size={32} />
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <h1 className="whitespace-nowrap text-base font-bold tracking-tight text-[#1b1b3a]">
                GST Reconciliation
              </h1>
              <span className="hidden whitespace-nowrap rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 sm:inline">
                GSTR-2B vs Books
              </span>
            </div>
          </div>

          <p className="hidden xl:block text-sm font-medium text-slate-500">
            Click a Taxable or GSTR-2B amount cell to edit inline.
          </p>
        </div>
      </header>

      {/* Main Grid Viewport */}
      <main className="mx-auto flex w-full min-h-0 max-w-[1600px] flex-1 flex-col gap-3.5 px-6 py-4">
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
