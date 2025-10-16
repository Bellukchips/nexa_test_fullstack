import z from "zod";

export const taskValidationSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    deadline: z.string().min(3),
    status: z.enum(['TO_DO', 'IN_PROGRESS', 'DONE']),
    created_by: z.string().min(3)
});