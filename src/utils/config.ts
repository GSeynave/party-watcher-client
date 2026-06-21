function getRequiredEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`${name} is not defined`);
  }

  return value;
}

export const config = {
  SERVER_HOST: getRequiredEnv("VITE_SERVER_HOST"),
  SERVER_PORT: getRequiredEnv("VITE_SERVER_PORT"),
};
