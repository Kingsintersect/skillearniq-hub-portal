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
export const nameSchema = (label: string, optional: boolean = false) => {
    let schema = z
        .string()
        .min(2, `${label} must be at least 2 characters`)
        .max(50, `${label} must not exceed 50 characters`)
        .regex(/^[a-zA-Z\s]+$/, `${label} can only contain letters and spaces`);

    // return optional ? schema.optional() : schema;
    return optional
        ? z.union([schema, z.literal(""), z.undefined()])
        : schema;
};

export const usernameSchema = (name: string, optional: boolean = false) => {
    let schema = z
        .string()
        .min(2, `${name} must be at least 2 characters`)
        .max(50, `${name} must not exceed 50 characters`)
        .regex(/^[a-zA-Z0-9!@#$%&*(),.:|_\-]+$/, `${name} can only contain letters and spaces`);

    return optional ? schema.optional() : schema;
}

export const regNumberSchema = (name: string, optional: boolean = false) => {
    let schema = z
        .string()
        .min(8, `${name} must be at least 8 characters`)
        .max(15, `${name} must not exceed 15 characters`)
        .regex(/^[A-Za-z0-9/]+$/, `${name} format is invalid`)
        .optional()
        .or(z.literal(""));
    return optional ? schema.optional() : schema;
}

export const imageFileSchema = z.instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine(validateFileSize, `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    .refine(validateFileType, `File type must be one of: ${ALLOWED_FILE_TYPES.join(', ')}`)
    .refine(validateFileExtension, `File extension must be one of: ${ALLOWED_EXTENSIONS.join(', ')}`);

export const emailSchema = (label?: string, optional: boolean = false) => {
    let schema = z.email("Please enter a valid email address")
        .min(1, `${label ?? "Email"}  is required `);

    // return optional ? schema.optional() : schema;
    return optional
        ? z.union([schema, z.literal(""), z.undefined()])
        : schema.min(1, `${label} is required`);
}

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

export const tokenSchema = z.string().min(1, "Reset token is required");

export const passwordSchema = z.string()
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters")
// .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//     'Password must contain at least one uppercase letter, lowercase letter, number, and special character');

export const confirmPasswordSchema = (password: string) => z.string().min(1, "Please confirm your password")

export const otpSchema = z.string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits");

export const phoneSchema = (optional: boolean = false) => {
    const schema = z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits")
        .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number");

    // return optional ? schema.optional() : schema;
    return optional
        ? z.union([schema, z.literal(""), z.undefined()])
        : schema;
}

export const shortStringSchema = (label: string, optional: boolean = false, minLength: number = 2, maxLength: number = 100) => {
    let schema = z.string()
        .min(minLength, `${label} must be at least 2 characters`)
        .max(maxLength, `${label} must be at most 100 characters`);
    return optional ? schema.optional() : schema;
}

export const longStringSchema = (label: string, optional: boolean = false) => {
    let schema = z.string()
        .min(2, `${label} must be at least 2 characters`)
    return optional ? schema.optional() : schema;
}

export const zipCodeSchema = (optional: boolean = false) => {
    let schema = z.number()
        .min(4, "Zip code must be at least 4 characters")
        .max(10, "Zip code must be at most 10 characters");
    return optional ? schema.optional() : schema;
}

export const urlSchema = (label: string, optional: boolean = false) => {
    let schema = z.string()
        .url("Invalid URL")
        .max(100, `${label} must be less than 100 characters`)
        .optional()
        .or(z.literal(""));

    return optional ? schema.optional() : schema;
}

export const termsSchema = z.boolean()
    .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
    });

export const dateOfBirthSchema = (optional: boolean = false) => {
    let schema = z.string()
        .min(1, "Date of birth is required")
        .refine((value) => !isNaN(Date.parse(value)), {
            message: "Invalid date format",
        });
    return optional ? schema.optional() : schema;
}

export const rememberMeSchema = z.coerce.boolean().optional();

export const genderSchema = z.enum(["Male", "Female"]).or(z.literal(""))
    .refine((val) => !!val, {
        message: "Please select your gender",
    });

export const priceSchema = (optional: boolean = false) => {
    let schema = z.string()
        .trim()
        .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format") //allows whole numbers or decimals with up to 2 decimal places(100, 250.50, 99.9).
        // .transform((val) => parseFloat(val)) // convert string -> number
        .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0");
    return optional ? schema.optional() : schema;
}

// GENERIC SCHEMA PARTS

// export const stringSchema = (name: string) => z.string()
//     .min(1, `${name} Must not be empty`);

export const selectMenuSchema = (name: string, optional: boolean = false) => {
    let schema = z.string()
        .min(1, `Please select your ${name}`);
    return optional ? schema.optional() : schema;
}

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

export const roleSchema = z.enum(["ADMIN", "STUDENT", "MANAGER", "TEACHER", "PARENT"]).default("STUDENT");

export const booleanOptionSchema = (optional: boolean = false) => {
    let schema = z.boolean();
    return optional ? schema.optional() : schema;
}
