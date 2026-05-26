import { z } from "zod";
import { RegexPattern, Number } from "../../../utils/enum";

const { EMAIL_REGEX, PASSWORD_SPECIAL, PASSWORD_NUMBER, PASSWORD_UPPERCASE, PASSWORD_LOWERCASE } =
    RegexPattern;

const { NUMBER_100 } = Number;
export const forgotSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email address is mandatory")
        .regex(EMAIL_REGEX, "Please enter a valid email address")
        .max(NUMBER_100, "Email must not exceed 100 characters"),
});
