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
    <>
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <Input
          type={type}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHasBeenModified(true);
          }}
        />
      </Field>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </>
  );
}
export default CustomInputField;
