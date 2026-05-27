import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Department name is mandatory")
    .max(50, "Maximum 50 characters allowed"),
});
