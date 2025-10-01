import { passwordSchema, emailSchema, nameSchema, selectMenuSchema, confirmPasswordSchema, genderSchema, phoneSchema, usernameSchema } from "@/lib/validations/zod"
import z, { object } from "zod"

// Define Zod Schemas for each step
export const personalInfoSchema = z.object({

    first_name: nameSchema('First name'),

    last_name: nameSchema('Last name'),

    other_name: nameSchema('Other name'),

    gender: genderSchema,

    nationality: selectMenuSchema('country'),

    state: selectMenuSchema('state', true),

    phone: phoneSchema(),
});

export const parentInfoSchema = z.object({
    parent_first_name: nameSchema('Parent First name', true),

    parent_last_name: nameSchema('Parent Last name', true),

    parent_email: emailSchema("Parent Email", true),

    parent_phone_number: phoneSchema(true),
});


export const accouintInfoSchema = z.object({
    email: emailSchema(),

    username: usernameSchema('username'),

    password: passwordSchema,

    confirmPassword: confirmPasswordSchema('password'),

}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const signUpSchema = object({
    ...personalInfoSchema.shape,
    ...parentInfoSchema.shape,
    ...accouintInfoSchema.shape,
});


export type SignUpFormData = z.infer<typeof signUpSchema>;
