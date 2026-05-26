import * as zod from "zod";

export const departmentSchema = zod.object({
  name: zod
    .string()
    .trim()
    .min(1, "Department name is mandatory")
    .max(150, "Maximum 150 characters allowed"),
});