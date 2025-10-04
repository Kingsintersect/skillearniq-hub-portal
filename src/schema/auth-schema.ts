import { emailSchema, passwordSchema, rememberMeSchema, tokenSchema, confirmPasswordSchema, otpSchema } from "@/lib/validations/zod"
import z, { object } from "zod"

// SIGNIN SCHEMA
export const loginInSchema = object({
    email: emailSchema(),
    password: passwordSchema,
    rememberMe: rememberMeSchema,
    userType: z.literal('general'),
})
export const parentLoginSchema = z.object({
    email: emailSchema(),
    otp: otpSchema,
    rememberMe: rememberMeSchema,
    userType: z.literal('parent'),
});
export const parentOTPRequestSchema = z.object({
    email: emailSchema(),
    rememberMe: rememberMeSchema,
    userType: z.literal('parentotprequest'),
});
export const signInSchema = z.discriminatedUnion('userType', [
    loginInSchema,
    parentLoginSchema,
    parentOTPRequestSchema,
]);

export type StudentLoginInput = z.infer<typeof loginInSchema>;
export type ParentLoginInput = z.infer<typeof parentLoginSchema>;
export type signInFormData = z.infer<typeof signInSchema>;

// FORGOT PASSWORD SCHEMA
export const forgotPasswordSchema = object({
    email: emailSchema(),
});
export type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// FORGOT PASSWORD SCHEMA
export const resetPasswordSchema = object({
    email: emailSchema(),
    token: tokenSchema,
    password: passwordSchema,
    password_confirmation: confirmPasswordSchema('password'),
});
export type resetPasswordFormData = z.infer<typeof resetPasswordSchema>;

