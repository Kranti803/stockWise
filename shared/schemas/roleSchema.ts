import z from "zod";

export const roleSchema = z.object({
    name: z.enum(["ADMIN", "WAREHOUSE_MANAGER", "STAFF"]),
    permissions: z.array(z.string()),
    description: z.string().optional(),
    isSystem: z.boolean().optional().default(true),
});

export type RoleSchema = z.infer<typeof roleSchema>;
