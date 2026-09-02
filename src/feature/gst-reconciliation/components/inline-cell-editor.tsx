import React, { useState, useEffect, useRef } from "react";
import type { EditableField } from "@/feature/gst-reconciliation/types/gst";
import { formatINR } from "@/lib/utils";

interface InlineCellEditorProps {
  id: string;
  field: EditableField;
  value: number | null;
  onSave: (id: string, field: EditableField, value: string | number) => void;
}

/**
 * A single editable amount cell. Click to edit, Enter or blur to save,
 * Escape to cancel.
 */
export const InlineCellEditor: React.FC<InlineCellEditorProps> = ({
  id,
  field,
  value,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value === null ? "" : String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the draft whenever the row's value changes underneath us
  // (e.g. after a bulk action).
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setDraft(value === null ? "" : String(value));
  }

  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  const save = () => {
    setIsEditing(false);
    onSave(id, field, draft.trim() === "" ? "" : Number(draft));
  };

  const cancel = () => {
    setDraft(value === null ? "" : String(value));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
        className="w-full rounded-md border border-indigo-500 bg-white px-2 py-1 text-right text-sm tabular-nums ring-2 ring-indigo-100 focus:outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      title={value === null ? "Click to edit" : `${formatINR(value)} — click to edit`}
      className="block w-full truncate rounded-md px-2 py-1 text-right text-sm tabular-nums decoration-slate-300 decoration-dotted underline-offset-4 hover:bg-indigo-50 hover:underline focus-visible:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      {value === null ? "—" : formatINR(value)}
    </button>
  );
};
