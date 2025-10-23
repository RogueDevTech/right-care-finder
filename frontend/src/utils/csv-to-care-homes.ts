/**
 * Utility to convert CSV data to care home JSON format
 */

export interface CSVCareHome {
  title?: string;
  name?: string;
  totalScore?: string;
  reviewsCount?: string;
  street?: string;
  addressLine1?: string;
  address?: string;
  city?: string;
  state?: string;
  region?: string;
  countryCode?: string;
  country?: string;
  website?: string;
  phone?: string;
  telephone?: string;
  categoryName?: string;
  type?: string;
  url?: string;
  rating?: string;
  reviews?: string;
}

export interface CareHomeImportData {
  name: string;
  description: string[];
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  phone: string;
  email?: string;
  website?: string;
  careTypeId: number;
  weeklyPrice?: number;
  monthlyPrice?: number;
  totalBeds?: number;
  availableBeds?: number;
  isActive: boolean;
  specializations?: string[];
}

/**
 * Advanced CSV parser that handles quoted fields and different delimiters
 */
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      // Handle escaped quotes ("")
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Parse CSV text into array of objects
 */
export function parseCSV(csvText: string): CSVCareHome[] {
  // Normalize line endings (handle \r\n, \r, and \n)
  const normalizedText = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalizedText.trim().split("\n");

  if (lines.length < 2) {
    throw new Error(
      "CSV file must have at least a header row and one data row"
    );
  }

  // Detect delimiter (tab, comma, pipe, or semicolon)
  const firstLine = lines[0];
  let delimiter = ",";

  if (firstLine.includes("\t")) {
    delimiter = "\t";
  } else if (firstLine.includes("|")) {
    delimiter = "|";
  } else if (firstLine.includes(";")) {
    delimiter = ";";
  }

  console.log(
    "Detected delimiter:",
    delimiter === "\t" ? "TAB" : delimiter === "," ? "COMMA" : delimiter
  );

  const headers = parseCSVLine(lines[0], delimiter).map((h) => h.trim());
  const data: CSVCareHome[] = [];

  console.log("CSV Headers detected:", headers);
  console.log("Number of headers:", headers.length);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCSVLine(line, delimiter);

    if (values.length !== headers.length) {
      console.warn(
        `Row ${i + 1}: Column mismatch - expected ${headers.length}, got ${
          values.length
        }`
      );
    }

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim() || "";
      row[header] = value;
    });

    // Only log first 3 rows to avoid console spam
    if (i <= 3) {
      console.log(`Row ${i}:`, row);
    }

    data.push(row as CSVCareHome);
  }

  console.log(`Parsed ${data.length} rows from CSV`);
  return data;
}

/**
 * Extract postcode from Google Maps URL or return empty string
 */
function extractPostcodeFromCity(city?: string, state?: string): string {
  // Try to extract postcode pattern from state field if provided
  if (state && state.trim() !== "") {
    const postcodePattern = /[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}/i;
    const match = state.match(postcodePattern);
    if (match) {
      return match[0];
    }
  }
  return "";
}

/**
 * Determine care type ID based on category name
 */
function determineCareTypeId(categoryName: string): number {
  const category = categoryName.toLowerCase();

  if (category.includes("nursing")) {
    return 1; // Nursing home
  } else if (category.includes("residential")) {
    return 2; // Residential care
  } else if (category.includes("dementia")) {
    return 3; // Dementia care
  } else if (category.includes("assisted living")) {
    return 4; // Assisted living
  }

  return 1; // Default to nursing home
}

/**
 * Convert country code to full country name
 */
function getCountryName(countryCode: string): string {
  const countryMap: { [key: string]: string } = {
    GB: "United Kingdom",
    UK: "United Kingdom",
    US: "United States",
    IE: "Ireland",
    // Add more as needed
  };

  return countryMap[countryCode.toUpperCase()] || "United Kingdom";
}

/**
 * Extract region from city or state
 */
function extractRegion(city?: string, state?: string): string {
  // Common UK regions
  const regionMap: { [key: string]: string } = {
    edinburgh: "Scotland",
    glasgow: "Scotland",
    aberdeen: "Scotland",
    dundee: "Scotland",
    "juniper green": "Scotland",
    london: "Greater London",
    manchester: "Greater Manchester",
    birmingham: "West Midlands",
    leeds: "Yorkshire",
    liverpool: "Merseyside",
    // Add more as needed
  };

  if (city && city.trim() !== "") {
    const cityLower = city.toLowerCase();

    for (const [key, value] of Object.entries(regionMap)) {
      if (cityLower.includes(key)) {
        return value;
      }
    }
  }

  return state && state.trim() !== "" ? state : "Scotland"; // Default to Scotland based on your data
}

/**
 * Convert CSV care home to import format
 */
export function convertCSVToImportFormat(
  csvCareHome: CSVCareHome
): CareHomeImportData {
  // Log the raw CSV data to debug
  console.log("Converting CSV row:", csvCareHome);

  // Extract title/name from CSV (could be 'title' or 'name')
  const title = csvCareHome.title || csvCareHome.name || "Unnamed Care Home";
  const street =
    csvCareHome.street || csvCareHome.addressLine1 || csvCareHome.address || "";
  const city = csvCareHome.city || "";
  const state = csvCareHome.state || csvCareHome.region || "";
  const phone = csvCareHome.phone || csvCareHome.telephone || "";
  const website = csvCareHome.website || csvCareHome.url || "";
  const categoryName =
    csvCareHome.categoryName || csvCareHome.type || "Care facility";
  const countryCode = csvCareHome.countryCode || csvCareHome.country || "GB";
  const totalScore = csvCareHome.totalScore || csvCareHome.rating || "";
  const reviewsCount = csvCareHome.reviewsCount || csvCareHome.reviews || "";

  const postcode = extractPostcodeFromCity(city, state);
  const region = extractRegion(city, state);
  const careTypeId = determineCareTypeId(categoryName);
  const country = getCountryName(countryCode);

  // Generate description from available data
  const description: string[] = [];
  description.push(`${categoryName} located in ${city || "Unknown location"}.`);

  if (totalScore && parseFloat(totalScore) > 0) {
    const reviewCount = reviewsCount || "0";
    description.push(
      `Rated ${totalScore} stars based on ${reviewCount} reviews.`
    );
  }

  const cleanName = title.replace(/\s*-\s*Care UK\s*$/, "").trim();

  const result = {
    name: cleanName,
    description,
    addressLine1: street || "Address not provided",
    addressLine2: "",
    city: city || "Unknown",
    region,
    postcode: postcode || "EH0 0XX",
    country,
    phone: phone || "+44 000 000 0000",
    email: "",
    website: website || "",
    careTypeId,
    weeklyPrice: undefined,
    monthlyPrice: undefined,
    totalBeds: undefined,
    availableBeds: undefined,
    isActive: true,
    specializations: [categoryName],
  };

  console.log("Converted to:", result);
  return result;
}

/**
 * Main conversion function
 */
export function convertCSVToCareHomes(csvText: string): CareHomeImportData[] {
  const csvData = parseCSV(csvText);
  return csvData.map(convertCSVToImportFormat);
}

/**
 * Validate care home data before import
 */
export function validateCareHome(careHome: CareHomeImportData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!careHome.name || careHome.name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (!careHome.addressLine1 || careHome.addressLine1.trim().length === 0) {
    errors.push("Address is required");
  }

  if (!careHome.city || careHome.city.trim().length === 0) {
    errors.push("City is required");
  }

  if (!careHome.postcode || careHome.postcode.trim().length === 0) {
    errors.push("Postcode is required");
  }

  if (!careHome.phone || careHome.phone.trim().length === 0) {
    errors.push("Phone is required");
  }

  if (!careHome.careTypeId || careHome.careTypeId < 1) {
    errors.push("Valid care type ID is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
