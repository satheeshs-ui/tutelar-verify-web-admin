import { z } from "zod";
import { RegexPattern, Number } from "../../../utils/enum";
const { EMAIL_REGEX, NAME_REGEX, MOBILE_REGEX } = RegexPattern;
const { ONE_FIFTY, TWO_FIFTY_FIVE, NUMBER_250 } = Number;

export const clientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is mandatory")
    .min(3, "Name must be at least 3 characters")
    .regex(NAME_REGEX, "Name must contain only alphabets")
    .max(ONE_FIFTY, "Name must not exceed 150 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is mandatory")
    .regex(EMAIL_REGEX, "Please enter a valid email address")
    .max(TWO_FIFTY_FIVE, "Email must not exceed 255 characters"),

  mobile: z
    .string()
    .trim()
    .min(1, "Mobile number is mandatory")
    .regex(MOBILE_REGEX, "Mobile number must be 10 digits"),

  address: z
    .string()
    .trim()
    .min(1, "Address is mandatory")
    .max(TWO_FIFTY_FIVE, "Address must not exceed 255 characters")
    .refine(
      (address) => {
        const hasPincode = /\b\d{6}\b/.test(address);
        return hasPincode;
      },
      {
        message: "Please include a 6-digit pincode in your address",
      },
    ),

  url: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(NUMBER_250, "URL must not exceed 250 characters")
    .optional()
    .or(z.literal("")),

  entityType: z.enum(
    [
      "individual",
      "partnership",
      "private_limited",
      "sole_proprietorship",
      "ngo_trust",
      "public_limited",
    ],
    {
      errorMap: () => ({
        message:
          "Entity type must be one of: individual, partnership, private_limited, sole_proprietorship, ngo_trust, or public_limited",
      }),
    },
  ),
});
