import { passwordSchema, emailSchema, nameSchema, regNumberSchema, selectMenuSchema, confirmPasswordSchema, genderSchema, phoneSchema, priceSchema, addressSchema, usernameSchema } from "@/lib/validations/zod"
import z, { object } from "zod"

// Define Zod Schemas for each step
export const personalInfoSchema = z.object({

    first_name: nameSchema('First name'),

    last_name: nameSchema('Last name'),

    other_name: nameSchema('Other name'),

    gender: genderSchema,

    nationality: selectMenuSchema('country'),

    state: selectMenuSchema('state'),

    phone_number: phoneSchema,

    hometown_address: addressSchema('hometown address'),

    residential_address: addressSchema('residential address'),
});


export const academicInfoSchema = z.object({
    regNumber: regNumberSchema('Reg. Number'),

    program: selectMenuSchema('program'),

    program_id: selectMenuSchema('program_id'),

    academic_session: selectMenuSchema('academic session'),

    academic_semester: selectMenuSchema('academic semster'),

    start_year: selectMenuSchema('academic year'),
});


export const accouintInfoSchema = z.object({
    email: emailSchema,

    username: usernameSchema('username'),

    password: passwordSchema,

    confirmPassword: confirmPasswordSchema('password'),

    amount: priceSchema,

}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const signUpSchema = object({
    ...personalInfoSchema.shape,
    ...academicInfoSchema.shape,
    ...accouintInfoSchema.shape,
});


export type SignUpFormData = z.infer<typeof signUpSchema>;
