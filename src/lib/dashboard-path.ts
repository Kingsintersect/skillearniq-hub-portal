/**
 * Single source of truth for the post-auth landing route of each role.
 *
 * Previously duplicated inline across the sign-in, register and auth-layout
 * pages; centralised here so the invite-acceptance flow and the auth pages
 * agree on where a given role should land.
 */
export function dashboardPathForRole(role?: string): string {
  switch ((role ?? "").toLowerCase()) {
    case "student":
      return "/subscription";
    case "parent":
      return "/subscription/family";
    case "teacher":
    case "tutor":
      return "/teacher/dashboard";
    case "admin":
    case "manager":
    case "super_admin":
      return "/admin/dashboard";
    default:
      return "/subscription";
  }
}
