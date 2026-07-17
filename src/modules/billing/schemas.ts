import { z } from "zod";

export const checkoutSchema = z.object({
  payment_method: z.enum(["card", "bank_transfer"], {
    message: "Choose a payment method",
  }),
  coupon_code: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .optional()
    .or(z.literal("")),
  use_wallet_credit: z.boolean().default(false),
});
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
