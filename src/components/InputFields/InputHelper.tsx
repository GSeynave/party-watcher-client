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

type EmailInputProps = {
  value: string;
  onChange: (value: string) => void;
};
export function EmailInput(props: EmailInputProps) {
  return <CustomInputField {...props} label="Email" validate={validateEmail} />;
}

function validatePassword(value: string): string | null {
  if (value.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return null;
}

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
};
export function PasswordInput(props: PasswordInputProps) {
  return (
    <CustomInputField
      {...props}
      type="password"
      label="Password"
      validate={validatePassword}
    />
  );
}
