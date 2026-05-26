import { z } from "zod";
import { RegexPattern, Number } from "../../../utils/enum";
import dayjs from "dayjs";
const { EMAIL_REGEX, NAME_REGEX, MOBILE_REGEX, PAN_REGEX } = RegexPattern;
const { NUMBER_100, NUMBER_250 } = Number;

export const caseSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is mandatory")
        .min(3, "Name must be at least 3 characters")
        .regex(NAME_REGEX, "Name must contain only alphabets")
        .max(NUMBER_100, "Name must not exceed 100 characters"),

    email: z
        .string()
        .trim()
        .regex(EMAIL_REGEX, "Please enter a valid email address")
        .max(NUMBER_100, "Email must not exceed 100 characters")
        .optional()
        .or(z.literal("")),

    mobile: z
        .string()
        .trim()
        .regex(MOBILE_REGEX, "Mobile number must be 10 digits")
        .optional()
        .or(z.literal("")),

    panNumber: z
        .string()
        .trim()
        .regex(PAN_REGEX, "Please enter a valid PAN")
        .optional()
        .or(z.literal("")),

    address: z
        .string()
        .trim()
        .max(250, "Address must not exceed 250 characters")
        .optional()
        .or(z.literal(""))
        .refine(
            (address) => {
                if (!address || address.trim() === "") return true;

                const hasPincode = /\b\d{6}\b/.test(address);

                return hasPincode;
            },
            {
                message: "Please include a 6-digit pincode in your address",
            }
        ),
    url: z
        .string()
        .trim()
        .url("Please enter a valid URL")
        .max(NUMBER_250, "URL must not exceed 250 characters")
        .optional()
        .or(z.literal("")),
    primaryLanguages: z.string().optional(),
    secondaryLanguages: z.array(z.string()).optional(), // ✅ ADD

    agent: z.string().optional(),
    agentName: z.string().optional(),
    entityType: z.enum(
        ["individual", "partnership", "private_limited", "sole_proprietorship", "ngo_trust"],
        {
            errorMap: () => ({
                message: "Entity type must be either 'individual' or 'partnership'",
            }),
        }
    ),
    // entityType: z.array(z.string()).min(1, "Entity type is required"),
    dob: z.preprocess((val) => (val ? dayjs(val).toDate() : null), z.date().nullable()),

    scheduledDate: z.preprocess((val) => (val ? dayjs(val).toDate() : null), z.date().nullable()),
});
