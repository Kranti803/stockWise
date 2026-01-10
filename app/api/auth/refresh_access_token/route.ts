import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getSafeUser } from "@/utils/getSafeUser";
import { setAccessAndRefreshTokens } from "@/utils/setAccessAndRefreshTokens";
import { handleApiErrors } from "@/utils/handleApiErrors";

export const GET = handleApiErrors(async function (req: NextRequest) {
    await dbConnect();

    const oldRefreshToken = req.cookies.get("refreshToken")?.value;

    if (!oldRefreshToken) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const user = await User.findOne({ "refreshTokens.token": oldRefreshToken });

    if (!user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    await user.removeRefreshToken(oldRefreshToken);
    const newRefreshToken = await user.generateRefreshToken();
    const newAccessToken = user.generateAccessToken();


    const response = NextResponse.json({
        message: "Access token refreshed successfully",
        user: getSafeUser(user),
    });

    const tokens = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
    await setAccessAndRefreshTokens(response, tokens);

    return response;
})
