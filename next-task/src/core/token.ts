"use client";
export function isTokenAvailable() {
    const token = localStorage.getItem("token");
    return token !== null
}

export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token")
}

export function removeToken() {
    localStorage.removeItem("token")
}