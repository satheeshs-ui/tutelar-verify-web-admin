import * as yup from "yup";

export const agentSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required("Agent name is required")
        .max(50, "Maximum 50 characters allowed"),

    email: yup.string().trim().required("Email is required").email("Invalid email format"),

    mobile: yup
        .string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Mobile must be 10 digits"),

    languages: yup?.array().when("appUserType", {
        is: (val) => val === "agent",
        then: () =>
            yup
                .array()
                .min(1, "At least one language is required")
                .required("Languages are required"),
        otherwise: () => yup.array().notRequired(),
    }),
});
