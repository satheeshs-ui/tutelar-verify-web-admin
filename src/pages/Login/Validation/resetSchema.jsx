import { z } from "zod";

// export const resetSchema = z
//     .object({
//         otp: z.string().min(6, "OTP must be 6 digits"),
//         password: z
//             .string()
//             .min(8, "Minimum 8 characters")
//             .regex(/[A-Z]/, "Must contain uppercase")
//             .regex(/[0-9]/, "Must contain number"),
//         confirmPassword: z.string().min(1, "Enter confirm password"),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//         message: "Passwords do not match",
//         path: ["confirmPassword"],
//     });

export const resetSchema = z
    .object({
        // otp: z
        //   .string()
        //   .nonempty("OTP is required")
        //   .length(6, "OTP must be 6 digits"),

        password: z
            .string()
            .nonempty("Password is required")
            .min(8, "Minimum 8 characters")
            .regex(/[A-Z]/, "Must contain at least one uppercase letter")
            .regex(/[0-9]/, "Must contain at least one number"),

        confirmPassword: z.string().nonempty("Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
