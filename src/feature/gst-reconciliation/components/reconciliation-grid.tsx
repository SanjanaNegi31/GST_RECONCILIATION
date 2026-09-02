import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Invoice, EditableField } from "@/feature/gst-reconciliation/types/gst";
import { Table, TableBody } from "@/components/ui/table";
import { GridHeader } from "./grid-header";
import { GridRow } from "./grid-row";

// Must match the row height set in grid-row.tsx (h-10), or the virtualizer's
// spacer maths drifts away from what's actually rendered.
const ROW_HEIGHT = 44;

interface ReconciliationGridProps {
  invoices: Invoice[];
  selectedIds: Set<string>;
  onToggleRow: (id: string, isShiftKey: boolean) => void;
  onToggleAll: () => void;
  onUpdateCell: (
    id: string,
    field: EditableField,
    value: string | number
  ) => void;
}

export const ReconciliationGrid: React.FC<ReconciliationGridProps> = ({
  invoices,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onUpdateCell,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Only the rows in view are mounted, so the DOM stays small however long the
  // list gets. Real <tr>s are kept (rather than absolutely positioned divs) so
  // the browser's table layout still sizes the columns.
  const virtualizer = useVirtualizer({
    count: invoices.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  const allSelected =
    invoices.length > 0 && invoices.every((inv) => selectedIds.has(inv.id));
  const someSelected = invoices.some((inv) => selectedIds.has(inv.id));

  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-900">No matching invoices</p>
        <p className="mt-1 text-sm text-slate-500">
          Try widening the date range or clearing the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <Table
        containerRef={scrollRef}
        containerClassName="min-h-0 flex-1 scrollbar-none"
        className="min-w-[1150px] table-fixed"
      >
        <colgroup>
          <col className="w-[44px]" />
          <col className="w-[18%]" />
          <col className="w-[12%]" />
          <col className="w-[10%]" />
          <col className="w-[8%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[7%]" />
          <col className="w-[12%]" />
        </colgroup>

        <GridHeader
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={onToggleAll}
        />

        <TableBody>
          {paddingTop > 0 && (
            <tr aria-hidden>
              <td colSpan={10} style={{ height: paddingTop }} />
            </tr>
          )}

          {virtualRows.map((row) => {
            const invoice = invoices[row.index];
            return (
              <GridRow
                key={invoice.id}
                invoice={invoice}
                isSelected={selectedIds.has(invoice.id)}
                onToggleSelect={onToggleRow}
                onUpdateCell={onUpdateCell}
              />
            );
          })}

          {paddingBottom > 0 && (
            <tr aria-hidden>
              <td colSpan={10} style={{ height: paddingBottom }} />
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
