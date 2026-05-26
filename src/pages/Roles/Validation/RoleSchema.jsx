import { z } from "zod";

export const roleSchema = z.object({
    rolename: z.string().min(1, "Role name is required"),
    rolecode: z.string().min(1, "Role code is required"),
});
