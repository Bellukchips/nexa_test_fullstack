import z from "zod";

export const registerValidationSchema = z.object({
    name: z.string().min(3),
    username: z.string().min(3),
    password: z.string().min(6)
})