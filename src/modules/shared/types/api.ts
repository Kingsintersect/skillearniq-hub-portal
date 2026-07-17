/**
 * Shared API envelope types.
 * These mirror the contract produced by `core/client.ts` (apiClient),
 * so every module's hooks/services can rely on a single shape.
 */

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

/**
 * Standard shape used by endpoints that wrap `success` alongside `data`,
 * e.g. registration, login, group, and invitation endpoints in the spec.
 */
export interface SuccessEnvelope<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/** Narrow a thrown value down to ApiError, since axios errors are normalized by the interceptor. */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "statusCode" in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred. Please try again.";
}

/** Field-level validation errors map (Laravel-style: { field: string[] }) */
export type FieldErrors = Record<string, string[]>;

export function getFieldErrors(error: unknown): FieldErrors | undefined {
  if (isApiError(error)) return error.errors;
  return undefined;
}
