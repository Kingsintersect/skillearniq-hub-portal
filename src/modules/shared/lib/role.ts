"use client";

/**
 * Tiny helper for role-branching views (e.g. the family page renders
 * completely different content for parent vs student). Kept here instead
 * of duplicated per-page since multiple dashboard pages need it.
 */
export function isRole<R extends string>(
  role: string | undefined,
  ...candidates: R[]
): boolean {
  return Boolean(role) && candidates.includes(role as R);
}
