import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function POST(req: Request) {
    const body = await req.json();

    try {
        const response = await axios.post(`${API_URL}/auth/register`, body);
        const token = response.data.data.access_token;

        const res = NextResponse.json(
            {
                success: true,
                message: response.data.meta?.message ?? "Register successful",
            },
            { status: 200 }
        );

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return res;
    } catch (error: any) {
        const message =
            error.response?.data?.meta?.message ||
            error.response?.data?.data?.message ||
            "Register failed";

        return NextResponse.json({ success: false, message }, { status: 401 });
    }
}
