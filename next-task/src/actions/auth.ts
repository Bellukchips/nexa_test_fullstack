import { removeToken } from "@/core/token";
import { loginValidationSchema } from "@/validations/login";
import { registerValidationSchema } from "@/validations/register";
import z from "zod";



export async function login(data: z.infer<typeof loginValidationSchema>) {
    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        localStorage.setItem("token", result.token);
        return {
            success: result.success,
            message: result.message,
        };
    } catch (error) {
        console.error("Error logging in:", error);
        return {
            success: false,
            message: "Terjadi kesalahan koneksi",
        };
    }
}

export async function registerUser(data: z.infer<typeof registerValidationSchema>) {

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        localStorage.setItem("token", result.token);
        return {
            success: result.success,
            message: result.message,
        };
    } catch (error) {
        console.error("Error logging in:", error);
        return {
            success: false,
            message: "Terjadi kesalahan koneksi"
        };
    }
}

export async function logout() {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
        });

        const result = await response.json();
        removeToken();
        return {
            success: result.success,
            message: result.message,
        };
    } catch (error) {
        console.log("Error logging out:", error);
        return {
            success: false
        };
    }
}