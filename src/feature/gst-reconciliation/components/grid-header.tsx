import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Sticky has to live on the cells rather than <thead>, which browsers won't
// stick reliably. The border goes here too, for the same reason.
const HEAD =
  "sticky top-0 z-10 h-11 border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-800";

interface GridHeaderProps {
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  allSelected,
  someSelected,
  onToggleSelectAll,
}) => (
  <TableHeader>
    <TableRow className="border-0 hover:bg-transparent">
      <TableHead className={cn(HEAD, "overflow-visible px-2")}>
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={onToggleSelectAll}
          aria-label="Select all rows"
        />
      </TableHead>
      <TableHead className={HEAD}>Vendor</TableHead>
      <TableHead className={HEAD}>GSTIN</TableHead>
      <TableHead className={HEAD}>Invoice</TableHead>
      <TableHead className={HEAD}>Date</TableHead>
      <TableHead className={cn(HEAD, "text-right")}>Taxable</TableHead>
      <TableHead className={cn(HEAD, "text-right")}>Total</TableHead>
      <TableHead className={cn(HEAD, "text-right")}>GSTR-2B</TableHead>
      <TableHead className={cn(HEAD, "text-right")}>Diff</TableHead>
      <TableHead className={cn(HEAD, "text-right")}>Status</TableHead>
    </TableRow>
  </TableHeader>
);
