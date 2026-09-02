import React from "react";
import type { Invoice, EditableField } from "@/feature/gst-reconciliation/types/gst";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { InlineCellEditor } from "./inline-cell-editor";
import { STATUS_META } from "./status";
import { formatINR, formatDate, cn } from "@/lib/utils";

interface GridRowProps {
  invoice: Invoice;
  isSelected: boolean;
  onToggleSelect: (id: string, isShiftKey: boolean) => void;
  onUpdateCell: (
    id: string,
    field: EditableField,
    value: string | number
  ) => void;
}

export const GridRow: React.FC<GridRowProps> = ({
  invoice,
  isSelected,
  onToggleSelect,
  onUpdateCell,
}) => {
  const status = STATUS_META[invoice.status];
  const difference =
    invoice.gstr2b_amount === null
      ? null
      : invoice.total_amount - invoice.gstr2b_amount;

  return (
    <TableRow
      className={cn(
        "h-11 text-sm text-slate-700",
        isSelected ? "bg-indigo-50 hover:bg-indigo-100" : status.row
      )}
    >
      <TableCell className="overflow-visible px-2">
        <Checkbox
          checked={isSelected}
          onChange={(e) =>
            onToggleSelect(invoice.id, (e.nativeEvent as MouseEvent).shiftKey)
          }
          aria-label={`Select invoice ${invoice.invoice_number}`}
        />
      </TableCell>

      <TableCell className="truncate font-medium text-slate-900">
        {invoice.vendor_name}
      </TableCell>

      <TableCell className="truncate font-mono text-xs text-slate-500">
        {invoice.vendor_gstin}
      </TableCell>

      <TableCell className="truncate font-mono text-xs text-slate-500">
        {invoice.invoice_number}
      </TableCell>

      <TableCell className="text-slate-500">
        {formatDate(invoice.invoice_date)}
      </TableCell>

      <TableCell className="p-1">
        <InlineCellEditor
          id={invoice.id}
          field="taxable_amount"
          value={invoice.taxable_amount}
          onSave={onUpdateCell}
        />
      </TableCell>

      <TableCell
        className="text-right font-medium tabular-nums text-slate-900"
        title={formatINR(invoice.total_amount)}
      >
        {formatINR(invoice.total_amount)}
      </TableCell>

      <TableCell className="p-1">
        <InlineCellEditor
          id={invoice.id}
          field="gstr2b_amount"
          value={invoice.gstr2b_amount}
          onSave={onUpdateCell}
        />
      </TableCell>

      <TableCell
        className={cn(
          "text-right tabular-nums",
          difference ? "font-medium text-rose-600" : "text-slate-400"
        )}
        title={difference ? formatINR(difference) : undefined}
      >
        {difference === null ? "—" : difference === 0 ? "0" : formatINR(difference)}
      </TableCell>

      <TableCell className="flex h-11 items-center justify-end gap-1">
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium",
            status.badge
          )}
          title={status.label}
        >
          {status.short}
        </span>
        {invoice.isEdited && (
          <span className="ml-1 text-slate-400" title="Edited">
            •
          </span>
        )}
      </TableCell>
    </TableRow>
  );
};
