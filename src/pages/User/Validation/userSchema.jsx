// import { z } from "zod";
// import { RegexPattern, Number } from "../../../utils/enum";

// const { EMAIL_REGEX, NAME_REGEX, MOBILE_REGEX } = RegexPattern;

// const { NUMBER_100 } = Number;

// export const agentSchema = z.object({
//     name: z
//         .string()
//         .trim()
//         .min(1, "Name is mandatory")
//         .regex(NAME_REGEX, "Name must contain only alphabets")
//         .max(NUMBER_100, "Name must not exceed 100 characters"),

//     email: z
//         .string()
//         .trim()
//         .min(1, "Email is mandatory")
//         .regex(EMAIL_REGEX, "Please enter a valid email address")
//         .max(NUMBER_100, "Email must not exceed 100 characters"),

//     mobile: z
//         .string()
//         .trim()
//         .min(1, "Mobile number is mandatory")
//         .min(10, "Mobile number must be 10 digits")
//         .regex(MOBILE_REGEX, "Please enter a valid mobile number"),
// });

import { Languages } from "lucide-react";
import * as yup from "yup";

export const agentSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("User first name is required")
        .max(16, "Maximum 16 characters allowed"),

    email: yup.string().trim().required("Email is required").email("Invalid email format"),

    mobile: yup
        .string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Mobile must be 10 digits"),

    roleId: yup.string().required("Role is required"),

    languages: yup.array().when("appUserType", (role) => {
        if (role[0] === "agent") {
            return yup
                .array()
                .min(1, "At least one language is required")
                .required("Languages are required");
        }
        return yup.array().strip();
    }),
});
