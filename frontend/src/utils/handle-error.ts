import { toast } from "react-hot-toast";

export const handleError = (error: string | string[]) => {
  // Handle API error response structure

  if (Array.isArray(error)) {
    toast.error(error.join(", "));
    return;
  }

  // Handle string errors
  if (typeof error === "string") {
    toast.error(error);
    return;
  }
};
