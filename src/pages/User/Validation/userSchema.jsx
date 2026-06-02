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

import { Languages } from 'lucide-react';
import * as yup from 'yup';

export const agentSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required('User first name is required')
    .max(75, 'Maximum 75 characters allowed'),

  lastName: yup
    .string()
    .trim()
    .required('User Last name is required')
    .max(75, 'Maximum 75 characters allowed'),

  email: yup
    .string()
    .trim()
    .required('Email ID is required')
    .email('Please enter a valid Email ID')
    .max(255, 'Email ID must not exceed 255 characters'),

  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile must be 10 digits'),

  roleId: yup.string().required('Role is required'),

  designation: yup.string().trim().max(150, 'Maximum 150 characters allowed'),

  department: yup.string().trim().max(150, 'Maximum 150 characters allowed'),

  roleName: yup.string().required('Role name is required'),
  roleLevel: yup.string().required('Role level is required'),

  userType: yup
  .string()
  .required('User type is required'),

  languages: yup.array().when('appUserType', role => {
    if (role[0] === 'agent') {
      return yup
        .array()
        .min(1, 'At least one language is required')
        .required('Languages are required');
    }
    return yup.array().strip();
  }),
});
