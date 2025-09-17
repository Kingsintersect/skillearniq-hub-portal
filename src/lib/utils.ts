import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
) {
  // Node.js and browser timers resolve differently → use ReturnType<typeof setTimeout>
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => func(...args), delay);
  };
}


/**
 * CURRENCY FORMATTER
 */
export function formatToCurrency(
  amount: number,
  currency: string = "NGN",
  locale: string = "en-NG"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
export function formatNumberWithCommas(amount: number): string {
  return amount.toLocaleString("en-NG");
}

/**
 * Generic filter function that works for any dataset
 */
export function filterData<T extends Record<string, unknown>>(
  data: T[],
  filterKey: keyof T | null,
  filterValue: string | number | 'ALL',
  searchKeys: (keyof T)[],
  query: string
): T[] {
  let result = [...data]; // Avoid mutating the original array

  // If ALL is the filterValue, return all data
  if (filterValue === "ALL") result = result;

  // Apply filter if filterKey and filterValue exist
  if (filterValue !== "ALL" && filterKey && filterValue !== undefined) {
    result = result.filter((item) => {
      const itemValue = item[filterKey];

      // Check if either value is a number and convert both to the same type before comparison
      if (typeof itemValue === "number" && typeof filterValue === "string") {
        return itemValue === Number(filterValue); // Convert string to number
      } else if (
        typeof itemValue === "string" &&
        typeof filterValue === "number"
      ) {
        return Number(itemValue) === filterValue; // Convert string to number
      } else {
        return itemValue === filterValue; // Direct comparison for same types
      }
    });
  }

  // Apply search filtering if query exists
  if (query) {
    const lowerQuery = query.toLowerCase();
    result = result.filter((item) =>
      searchKeys.some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(lowerQuery)
      )
    );
  }

  return result;
}

export const formatFieldName = (str: string, options = { separator: '_', replaceWith: ' ' }) => {
  return str
    .replace(new RegExp(options.separator, 'g'), options.replaceWith)
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const UniversalformatFieldName = (str: string, options = { separator: '_', replaceWith: ' ' }) => {
  /**
   * formatFieldName("first_name"); // "First Name"
   * formatFieldName("firstName"); // "First Name"
   * formatFieldName("status");     // "Status"
   */
  return str
    // .replace(/_/g, ' ')
    .replace(new RegExp(options.separator, 'g'), options.replaceWith)
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Adds space before capital letters
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export function getApiHost(url?: string): string {
  try {
    return url ? new URL(url).hostname : "";
  } catch {
    return "";
  }
}