import CustomInputField from "./CustomInputField";

function validateEmail(value: string): string | null {
  if (!value) {
    return "Please fill in the email field.";
  }
  if (!/\S+@\S+\.\S+/.test(value)) {
    return "Please enter a valid email address.";
  }
  return null;
}

export function EmailInput(props: any) {
  return <CustomInputField {...props} label="Email" validate={validateEmail} />;
}

function validatePassword(value: string): string | null {
  if (value.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return null;
}
export function PasswordInput(props: any) {
  return (
    <CustomInputField
      {...props}
      type="password"
      label="Password"
      validate={validatePassword}
    />
  );
}
