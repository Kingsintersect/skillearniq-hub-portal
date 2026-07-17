import { z } from "zod";

export const sendInvitationSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
export type SendInvitationFormValues = z.infer<typeof sendInvitationSchema>;

export const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Invitation token is required"),
});
export type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;
