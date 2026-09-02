import React from "react";
import type { DateRange } from "react-day-picker";
import { CalendarDays, RotateCcw, Search } from "lucide-react";
import type { Filters, StatusFilter } from "@/feature/gst-reconciliation/types/gst";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_META, STATUS_ORDER } from "./status";
import { formatDate, fromISODate, toISODate } from "@/lib/utils";

interface GridToolbarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  isFiltered: boolean;
  onResetFilters: () => void;
  dateBounds: { min: string; max: string };
  visibleCount: number;
  totalCount: number;
  selectedCount: number;
  onMarkReconciled: () => void;
  onClearSelection: () => void;
}

// Each control in the grouped bar, matching the reference layout. Height is
// kept in step with the search Input next to it.
const SEGMENT =
  "flex h-12 items-center gap-2 px-4 text-sm text-slate-700 transition-colors hover:bg-slate-50";

export const GridToolbar: React.FC<GridToolbarProps> = ({
  filters,
  setFilters,
  isFiltered,
  onResetFilters,
  dateBounds,
  visibleCount,
  totalCount,
  selectedCount,
  onMarkReconciled,
}) => {
  const range: DateRange | undefined =
    filters.dateFrom || filters.dateTo
      ? {
          from: fromISODate(filters.dateFrom),
          to: fromISODate(filters.dateTo),
        }
      : undefined;

  const handleRangeSelect = (next: DateRange | undefined) =>
    setFilters((prev) => ({
      ...prev,
      dateFrom: next?.from ? toISODate(next.from) : "",
      dateTo: next?.to ? toISODate(next.to) : "",
    }));

  const dateLabel = () => {
    if (filters.dateFrom && filters.dateTo)
      return `${formatDate(filters.dateFrom)} – ${formatDate(filters.dateTo)}`;
    if (filters.dateFrom) return `From ${formatDate(filters.dateFrom)}`;
    if (filters.dateTo) return `Until ${formatDate(filters.dateTo)}`;
    return "Invoice Date";
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          placeholder="Search invoices"
          aria-label="Search by vendor, invoice number or GSTIN"
          className="w-72 pl-9 text-sm"
        />
      </div>

      {/* Grouped filter bar */}
      <div className="flex items-center divide-x divide-slate-200 overflow-hidden rounded-lg border border-slate-300 bg-white">
        <Select
          value={filters.status}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, status: value as StatusFilter }))
          }
        >
          <SelectTrigger className={SEGMENT} aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_ORDER.map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_META[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger className={SEGMENT}>
            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
            {dateLabel()}
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              captionLayout="dropdown"
              defaultMonth={fromISODate(filters.dateFrom || dateBounds.min)}
              startMonth={new Date(2015, 0)}
              endMonth={new Date(2035, 11)}
              autoFocus
            />
            <div className="mt-2 flex justify-end border-t border-slate-100 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRangeSelect(undefined)}
                disabled={!filters.dateFrom && !filters.dateTo}
              >
                Clear dates
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <button
          onClick={onResetFilters}
          disabled={!isFiltered}
          className="flex h-12 items-center gap-2 px-4 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:text-slate-400 disabled:hover:bg-transparent"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {selectedCount > 0 ? (
          <>
            <span className="text-sm text-slate-600">
              <strong className="font-semibold text-slate-900">
                {selectedCount}
              </strong>{" "}
              selected
            </span>
            <Button onClick={onMarkReconciled}>Mark as reconciled</Button>

          </>
        ) : (
          <span className="text-sm text-slate-500">
            Showing{" "}
            <strong className="font-medium text-slate-900">
              {visibleCount.toLocaleString("en-IN")}
            </strong>{" "}
            of {totalCount.toLocaleString("en-IN")} invoices
          </span>
        )}
      </div>
    </div>
  );
};
