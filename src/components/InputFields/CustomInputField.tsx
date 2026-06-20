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
  const error = validate?.(value);
  return (
    <>
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>

      {error && <p>{error}</p>}
    </>
  );
}
export default CustomInputField;
