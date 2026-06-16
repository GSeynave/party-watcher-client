import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
      <Label>
        {label}
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Label>

      {error && <p>{error}</p>}
    </>
  );
}
export default CustomInputField;
