"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { getToken } from "../token";
import Login from "@/app/login/page";

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const token = getToken();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token, router]);

    if (!token) {
        return <Login />;
    }

    return <>{children}</>;
};

export default PrivateRoute;