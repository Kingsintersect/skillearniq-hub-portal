import { emailSchema, passwordSchema, rememberMeSchema, tokenSchema, confirmPasswordSchema } from "@/lib/validations/zod"
import z, { object } from "zod"

// SIGNIN SCHEMA
export const signInSchema = object({
    email: emailSchema,
    password: passwordSchema,
    rememberMe: rememberMeSchema,
})
export type signInFormData = z.infer<typeof signInSchema>;

// FORGOT PASSWORD SCHEMA
export const forgotPasswordSchema = object({
    email: emailSchema,
});
export type forgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// FORGOT PASSWORD SCHEMA
export const resetPasswordSchema = object({
    token: tokenSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema('password'),
});
export type resetPasswordFormData = z.infer<typeof resetPasswordSchema>;

