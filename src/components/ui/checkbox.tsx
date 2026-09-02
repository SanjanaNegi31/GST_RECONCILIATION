import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onChange, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);

    return (
      <label className="relative inline-flex items-center justify-center cursor-pointer select-none">
        <input
          type="checkbox"
          ref={inputRef}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 rounded border border-slate-300 bg-white flex items-center justify-center transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 text-white",
            indeterminate && "bg-indigo-600 border-indigo-600",
            className
          )}
        >
          {indeterminate ? (
            <Minus className="h-3 w-3 stroke-[3]" />
          ) : (
            checked && <Check className="h-3 w-3 stroke-[3]" />
          )}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
