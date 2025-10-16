import { NextResponse } from "next/server";

export async function POST() {
    try {
        const res = NextResponse.json({ success: true, message: "Logout berhasil" });

        res.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
            path: "/",
        });
        return res;
    } catch (error) {
        console.error("Error logging out:", error);
        return NextResponse.json({ success: false, message: "Logout gagal" }, { status: 500 });
    }
}
