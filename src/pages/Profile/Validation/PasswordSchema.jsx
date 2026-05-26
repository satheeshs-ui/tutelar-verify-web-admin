import { z } from "zod";
import { RegexPattern } from "../../../utils/enum";

const { PASSWORD_SPECIAL, PASSWORD_NUMBER, PASSWORD_UPPERCASE, PASSWORD_LOWERCASE } = RegexPattern;

const newpasswordField = z
    .string()
    .min(1, "New Password is mandatory")
    .max(18, "New Password must be maximum 18 characters")
    .regex(PASSWORD_UPPERCASE, "New Password must contain at least one uppercase letter (A–Z)")
    .regex(PASSWORD_LOWERCASE, "New Password must contain at least one lowercase letter (a–z)")
    .regex(PASSWORD_NUMBER, "New Password must contain at least one number (0–9)")
    .regex(
        PASSWORD_SPECIAL,
        "New Password must include at least one special character (@, $, !, %, *, ?, &)"
    );

const confirmPassword = z.string().min(1, "Confirm Password is mandatory");

const oldPasswordField = z.string().min(1, "Current password is mandatory");

export const passwordSchema = z
    .object({
        oldPassword: oldPasswordField,
        newPassword: newpasswordField,
        confirmPassword: confirmPassword,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Confirm password must match new password",
        path: ["confirmPassword"],
    });
