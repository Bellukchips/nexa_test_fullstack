"use client"

import { login } from "@/actions/auth";
import { loginValidationSchema } from "@/validations/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";


export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof loginValidationSchema>>({
        resolver: zodResolver(loginValidationSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    });


    const {
        register,
        handleSubmit,
    } = form;


    const onSubmit = async (values: z.infer<typeof loginValidationSchema>) => {
        setIsLoading(true);
        setMessage("");

        try {
            const result = await login(values);

            if (result.success) {
                setMessage("Login Successful");
                router.push("/mytasks");
            } else {
                setMessage(result.message || "Login gagal");
            }
        } catch (error: any) {
            console.error("Unexpected error:", error);
            setMessage("Terjadi kesalahan pada server atau koneksi");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex item-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md h-[600px] mt-20">
                <div className="flex justify-center mb-8">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <LogInIcon className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                <div className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Login
                </div>
                <p className="text-center text-gray-500 text-sm mb-8">Masukan username dan password</p>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {message}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div className="bloc text-sm font-medium text-gray-700 mb-2">
                            Username
                        </div>
                        <input
                            type="text"
                            id="username"
                            {...register("username")}
                            placeholder="Input username"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
                        />

                    </div>
                    <div className="relative">
                        <div className="bloc text-sm font-medium text-gray-700 mb-2">
                            Password
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            id="password"
                            placeholder="Input Password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition border-gray-300 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-sm text-gray-600"
                        >
                            {showPassword ?  <Eye /> :<EyeClosed />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded-lg font-medium text-white transition duration-200 ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                            }`}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Belum punya akun?{' '}
                    <a href="/register" className="text-blue-600 hover:underline font-medium">
                        Daftar di sini
                    </a>
                </p>
            </div>
        </div>
    );
}