import { z } from "zod";

/**
 * Password strength rule (Business Rule 1.2):
 * minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol.
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Add at least one uppercase letter")
  .regex(/[a-z]/, "Add at least one lowercase letter")
  .regex(/[0-9]/, "Add at least one number")
  .regex(/[^A-Za-z0-9]/, "Add at least one symbol");

/** Accepts either a valid email OR an international-style phone number. */
const identitySchema = z
  .string()
  .min(1, "Enter your email or phone number")
  .refine(
    (value) =>
      z.string().email().safeParse(value).success ||
      /^\+?[0-9]{7,15}$/.test(value.replace(/[\s-]/g, "")),
    { message: "Enter a valid email address or phone number" }
  );

const otpCodeSchema = z
  .string()
  .length(6, "Enter the 6-digit code")
  .regex(/^\d{6}$/, "Code must contain only numbers");

export const roleSelectSchema = z.object({
  role: z.enum(["student", "parent"], {
    message: "Choose a role to continue",
  }),
});
export type RoleSelectFormValues = z.infer<typeof roleSelectSchema>;

export const registerInitializeSchema = z
  .object({
    role: z.enum(["student", "parent"]),
    first_name: z.string().min(2, "First name is too short"),
    last_name: z.string().min(2, "Last name is too short"),
    email_or_phone_number: identitySchema,
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
export type RegisterInitializeFormValues = z.infer<
  typeof registerInitializeSchema
>;

export const otpVerifySchema = z.object({
  otp: otpCodeSchema,
});
export type OtpVerifyFormValues = z.infer<typeof otpVerifySchema>;

/**
 * Step 3: profile completion. Parent fields are optional, but if any parent
 * field is filled, email and the names become required together (Rule Block 2:
 * passive account conversion needs enough data to create or link a parent).
 */
export const registerCompleteSchema = z
  .object({
    gender: z.enum(["male", "female"], { message: "Select a gender" }),
    nationality: z.string().min(2, "Enter your nationality"),
    other_names: z.string().optional(),
    wantsParentLink: z.boolean().default(false),
    parent_first_name: z.string().optional(),
    parent_last_name: z.string().optional(),
    parent_email: z
      .string()
      .optional()
      .refine((v) => !v || z.string().email().safeParse(v).success, {
        message: "Enter a valid parent email",
      }),
    parent_phone_number: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.wantsParentLink) return;
    if (!data.parent_first_name) {
      ctx.addIssue({
        code: "custom",
        path: ["parent_first_name"],
        message: "Parent first name is required",
      });
    }
    if (!data.parent_last_name) {
      ctx.addIssue({
        code: "custom",
        path: ["parent_last_name"],
        message: "Parent last name is required",
      });
    }
    if (!data.parent_email) {
      ctx.addIssue({
        code: "custom",
        path: ["parent_email"],
        message: "Parent email is required to link or invite a parent",
      });
    }
  });
export type RegisterCompleteFormValues = z.infer<typeof registerCompleteSchema>;

export const loginSchema = z.object({
  email_or_phone_number: identitySchema,
  password: z.string().min(1, "Enter your password"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  identity: identitySchema,
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    otp_code: otpCodeSchema,
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
