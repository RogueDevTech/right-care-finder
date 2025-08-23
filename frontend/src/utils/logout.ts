import { useAuthStore } from "@/stores/auth.store";

export function logoutAndRedirect() {
  // Clear Zustand auth state
  useAuthStore.getState().clearAuth();
  // Remove session from localStorage
  localStorage.removeItem("session");
  // Redirect to login page
  window.location.href = "/sign-in";
}
