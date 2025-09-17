import z from "zod";

// Utility constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"] as const;
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png"] as const;

// Validation functions
const validateFileSize = (file: File): boolean => file.size <= MAX_FILE_SIZE;
const validateFileType = (file: File): boolean => ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number]);
const validateFileExtension = (file: File): boolean => {
    const extension = `.${file.name.toLowerCase().split('.').pop()}`;
    return ALLOWED_EXTENSIONS.includes(extension as typeof ALLOWED_EXTENSIONS[number]);
};
// Main schema
export const nameSchema = (name: string) => z
    .string()
    .min(2, `${name} must be at least 2 characters`)
    .max(50, `${name} must not exceed 50 characters`)
    .regex(/^[a-zA-Z\s]+$/, `${name} can only contain letters and spaces`);

export const usernameSchema = (name: string) => z
    .string()
    .min(2, `${name} must be at least 2 characters`)
    .max(50, `${name} must not exceed 50 characters`)
    .regex(/^[a-zA-Z0-9!@#$%&*(),.:|_\-]+$/, `${name} can only contain letters and spaces`);

export const regNumberSchema = (name: string) => z
    .string()
    .min(8, `${name} must be at least 8 characters`)
    .max(15, `${name} must not exceed 15 characters`)
    .regex(/^[A-Za-z0-9/]+$/, `${name} format is invalid`)
    .optional()
    .or(z.literal(""));

export const imageFileSchema = z.instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine(validateFileSize, `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    .refine(validateFileType, `File type must be one of: ${ALLOWED_FILE_TYPES.join(', ')}`)
    .refine(validateFileExtension, `File extension must be one of: ${ALLOWED_EXTENSIONS.join(', ')}`);

export const emailSchema = z.email("Please enter a valid email address")
    .min(1, "Email is required");

export const referenceEmailSchcema = z.string()
    .min(1, "Email or reference number is required")
    .refine((value) => {
        // Check if it's an email or reference number
        const isEmail = z.email("Please enter a valid email address").safeParse(value).success;
        const isReference = /^[A-Za-z0-9]{6,20}$/.test(value);
        return isEmail || isReference;
    }, {
        message: "Please enter a valid email address or reference number",
    });

export const token = z.string().min(1, "Reset token is required");

export const passwordSchema = z.string()
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters")
// .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//     'Password must contain at least one uppercase letter, lowercase letter, number, and special character');

export const confirmPasswordSchema = (password: string) => z.string()
    .min(1, "Please confirm your password")
    .refine((value) => value === password, {
        message: "Passwords don't match",
    });

export const otpSchema = z.string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits");

export const phoneSchema = z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number");

export const addressSchema = (name: string) => z.string()
    .min(5, `${name} must be at least 5 characters`)
    .max(200, `${name} must be at most 200 characters`);

export const citySchema = z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be at most 100 characters");

export const stateSchema = z.string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State must be at most 100 characters");

export const zipCodeSchema = z.string()
    .min(4, "Zip code must be at least 4 characters")
    .max(10, "Zip code must be at most 10 characters");

export const countrySchema = z.string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be at most 100 characters");

export const websiteSchema = z.string()
    .url("Invalid URL")
    .max(100, "Website must be less than 100 characters")
    .optional()
    .or(z.literal(""));

export const bioSchema = z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal(""));

export const termsSchema = z.boolean()
    .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    });

export const dateOfBirthSchema = z.string()
    .min(1, "Date of birth is required")
    .refine((value) => !isNaN(Date.parse(value)), {
        message: "Invalid date format",
    });

export const rememberMeSchema = z.coerce.boolean().optional();

export const genderSchema = z.enum(["Male", "Female"]).or(z.literal(""))
    .refine((val) => !!val, {
        message: "Please select your gender",
    });

export const priceSchema = z.string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format") //allows whole numbers or decimals with up to 2 decimal places(100, 250.50, 99.9).
    // .transform((val) => parseFloat(val)) // convert string -> number
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0");

// GENERIC SCHEMA PARTS

export const stringSchema = (name: string) => z.string()
    .min(1, `${name} Must not be empty`);

export const selectMenuSchema = (name: string) => z.string()
    .min(1, `Please select your ${name}`);


export const paginationSchema = z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
});
export const sortSchema = z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});
export const filterSchema = z.object({
    search: z.string().optional(),
});
export const idSchema = z.string().uuid("Invalid ID format");

export const createdAtSchema = z.date().default(() => new Date());
export const updatedAtSchema = z.date().default(() => new Date());

export const isActiveSchema = z.boolean().default(true);

export const isDeletedSchema = z.boolean().default(false);

export const roleSchema = z.enum(["ADMIN", "STUDENT", "MANAGER", "TEACHER   "]).default("STUDENT");

export const booleanOptionSchema = z.boolean().optional();
