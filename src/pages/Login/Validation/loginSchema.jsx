import { z } from "zod";
import { RegexPattern, Number } from "../../../utils/enum";

const { EMAIL_REGEX, PASSWORD_SPECIAL, PASSWORD_NUMBER, PASSWORD_UPPERCASE, PASSWORD_LOWERCASE } =
    RegexPattern;

const { NUMBER_100 } = Number;

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email address is mandatory")
        .regex(EMAIL_REGEX, "Please enter a valid email address")
        .max(NUMBER_100, "Email must not exceed 100 characters"),

    password: z.string().min(1, "Password is mandatory"),
    // .min(8, "Password must be at least 8 characters long")
    // .regex(
    //   PASSWORD_UPPERCASE,
    //   "Password must contain at least one uppercase letter (A–Z)"
    // )
    // .regex(
    //   PASSWORD_LOWERCASE,
    //   "Password must contain at least one lowercase letter (a–z)"
    // )
    // .regex(
    //   PASSWORD_NUMBER,
    //   "Password must contain at least one number (0–9)"
    // )
    // .regex(
    //   PASSWORD_SPECIAL,
    //   "Password must include at least one special character (@, $, !, %, *, ?, &)"
    // ),
});
