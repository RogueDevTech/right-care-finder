/**
 * Converts an unknown error value to a string for display purposes
 * @param error - The error value (unknown type)
 * @param fallback - Fallback message if error cannot be converted
 * @returns A string representation of the error
 */
export const errorToString = (
  error: unknown,
  fallback: string = "An error occurred"
): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return fallback;
};
