import { NextResponse } from "next/server";
import crypto from "crypto";

export const setAccessAndRefreshTokens = async (response: NextResponse, tokens: { accessToken: string, refreshToken: string }, providedCsrfToken?: string) => {
    const { accessToken, refreshToken } = tokens;

    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.JWT_EXPIRY),
    });

    response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Number(process.env.JWT_REFRESH_EXPIRY),
    });

    const csrfToken = providedCsrfToken || crypto.randomBytes(32).toString("hex");

    response.cookies.set("csrfToken", csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.JWT_EXPIRY),
    });
    return csrfToken;

};