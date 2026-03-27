export const logError = (description: string, error?: unknown) => {
  let message = `[Peerbound] ${description}`;
  if (error && typeof error === "object" && "message" in error) {
    message += `: ${error.message}`;
  }
  console.error(message);
};
