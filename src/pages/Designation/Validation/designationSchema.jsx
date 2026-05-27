import * as zod from "zod";

export const designationSchema = zod.object({
  name: zod
    .string()
    .trim()
    .min(1, "Designation name is mandatory")
    .max(150, "Maximum 150 characters allowed"),
});