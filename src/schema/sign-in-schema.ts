import { referenceEmailSchcema, passwordSchema, rememberMeSchema } from "@/lib/validations/zod"
import z, { object } from "zod"

export const signInSchema = object({
    reference: referenceEmailSchcema,
    password: passwordSchema,
    rememberMe: rememberMeSchema,
})

export type signInFormData = z.infer<typeof signInSchema>;