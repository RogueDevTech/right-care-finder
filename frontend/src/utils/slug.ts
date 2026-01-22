/**
 * Utility functions for creating URL-friendly slugs
 */

/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and underscores with hyphens
    .replace(/[\s_]+/g, "-")
    // Remove all non-word characters except hyphens
    .replace(/[^\w\-]+/g, "")
    // Replace multiple consecutive hyphens with a single hyphen
    .replace(/\-\-+/g, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Creates a URL path for a care home
 * @param region - The region/county name
 * @param careHomeName - The care home name
 * @returns A URL path like "/london/sunset-care-home"
 */
export function createCareHomeUrl(region: string, careHomeName: string): string {
  const regionSlug = createSlug(region);
  const nameSlug = createSlug(careHomeName);
  return `/${regionSlug}/${nameSlug}`;
}

/**
 * Parses a care home URL to extract region and name
 * @param pathname - The URL pathname (e.g., "/london/sunset-care-home")
 * @returns An object with region and name slugs, or null if invalid
 */
export function parseCareHomeUrl(pathname: string): {
  region: string;
  name: string;
} | null {
  // Remove leading slash and split by "/"
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  
  if (parts.length >= 2) {
    return {
      region: parts[0],
      name: parts.slice(1).join("-"), // Join in case name has multiple parts
    };
  }
  
  return null;
}
