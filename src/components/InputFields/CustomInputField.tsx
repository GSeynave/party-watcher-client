import { useState } from "react";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  validate?: (value: string) => string | null; // validation function that returns an error message or null if valid
};

function CustomInputField({
  label,
  value,
  onChange,
  type = "text",
  validate,
}: Props) {
  const [hasBeenModified, setHasBeenModified] = useState(false);
  const error = hasBeenModified && validate?.(value);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Field className="flex flex-col gap-1.5">
        {/* 1. Styled label to be elegant, uppercase, and match our warm stone hierarchy */}
        <FieldLabel className="text-xs font-bold uppercase tracking-wider text-stone-500 px-0.5">
          {label}
        </FieldLabel>

        {/* 2. Enhanced input with smooth corners, subtle warm border, and amber focus glow */}
        <Input
          type={type}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHasBeenModified(true);
          }}
          className="bg-white border-orange-100/70 focus-visible:ring-amber-500 text-stone-800 placeholder-stone-400 rounded-xl shadow-xs transition-all"
        />
      </Field>

      {/* 3. Cozy Error message formatting with an earthy rose tint instead of harsh red */}
      {error && (
        <div className="mt-0.5 rounded-lg bg-rose-50/60 border border-rose-100/40 px-2.5 py-1.5">
          <p className="text-xs font-semibold text-rose-700 leading-none">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

export default CustomInputField;
