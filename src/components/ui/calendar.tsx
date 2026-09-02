import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Calendar over react-day-picker v10. Every class name is overridden
 * here, which is why react-day-picker's own stylesheet isn't imported.
 *
 * With `captionLayout="dropdown"` the month and year become <select>s: the real
 * control is laid over the caption at opacity 0, and the styled span underneath
 * shows the current value. That's react-day-picker's own markup - the classes
 * below just dress it.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-fit", className)}
      classNames={{
        ...defaults,
        root: "relative",
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "flex flex-col gap-3",
        month_caption: "flex h-8 items-center justify-center px-9",
        caption_label:
          "flex items-center gap-1 text-sm font-medium text-slate-900",
        dropdowns: "flex items-center gap-1.5",
        dropdown_root:
          "relative inline-flex items-center rounded-md border border-slate-300 bg-white px-2 py-1 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500",
        dropdown: "absolute inset-0 cursor-pointer opacity-0",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous: cn(buttonVariants({ variant: "outline", size: "icon" })),
        button_next: cn(buttonVariants({ variant: "outline", size: "icon" })),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-8 text-[11px] font-normal text-slate-500",
        week: "mt-1 flex w-full",
        day: "h-8 w-8 p-0 text-center text-xs",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 rounded-md p-0 font-normal"
        ),
        today: "[&>button]:font-semibold [&>button]:text-indigo-600",
        outside: "text-slate-300 [&>button]:text-slate-300",
        disabled: "opacity-40",
        hidden: "invisible",
        range_start:
          "rounded-l-md bg-indigo-100 [&>button]:bg-indigo-600 [&>button]:text-white [&>button]:hover:bg-indigo-600",
        range_end:
          "rounded-r-md bg-indigo-100 [&>button]:bg-indigo-600 [&>button]:text-white [&>button]:hover:bg-indigo-600",
        range_middle: "bg-indigo-100 [&>button]:text-slate-900",
        selected: "",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") return <ChevronLeft className="h-4 w-4" />;
          if (orientation === "right")
            return <ChevronRight className="h-4 w-4" />;
          // "down" - the caret inside the month / year dropdowns.
          return <ChevronDown className="h-3.5 w-3.5 text-slate-500" />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
