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

function validateRoomName(value: string): string | null {
  if (!value) {
    return "Please fill in the room name field.";
  }
  if (value.length < 3) {
    return "Room name must be at least 3 characters long.";
  }
  return null;
}

function validateRoomUrl(value: string): string | null {
  if (!value) {
    return "Please fill in the room URL field.";
  }

  if (!isYoutubeEmbedUrl(value)) {
    return "Please enter a valid embed Youtube URL.";
  }
  return null;
}

function isYoutubeEmbedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    const isYoutubeDomain =
      url.hostname === "www.youtube.com" || url.hostname === "youtube.com";

    const isEmbedPath = url.pathname.startsWith("/embed/");
    const videoId = url.pathname.split("/embed/")[1];
    const hasValidId = !!videoId && videoId.length === 11;

    return isYoutubeDomain && isEmbedPath && hasValidId;
  } catch (error: unknown) {
    return false;
  }
}

type fieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
};

export function RoomUrlInput(props: fieldProps) {
  return <CustomInputField {...props} label="Url" validate={validateRoomUrl} />;
}
export function RoomNameInput(props: fieldProps) {
  return (
    <CustomInputField {...props} label="Name" validate={validateRoomName} />
  );
}
export function EmailInput(props: fieldProps) {
  return <CustomInputField {...props} label="Email" validate={validateEmail} />;
}

function validatePassword(value: string): string | null {
  if (value.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return null;
}

export function PasswordInput(props: fieldProps) {
  return (
    <CustomInputField
      label="Password"
      {...props}
      type="password"
      validate={validatePassword}
    />
  );
}
