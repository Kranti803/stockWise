import { NextResponse } from "next/server";

export const setAccessAndRefreshTokens = async (response: NextResponse, tokens: { accessToken: string, refreshToken: string }) => {
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

};