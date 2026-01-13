import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { handleApiErrors } from "@/utils/handleApiErrors";

export const POST = handleApiErrors(async function (req: NextRequest) {
    await dbConnect();
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const user = await User.findOne({ "refreshTokens.token": refreshToken });

    if (!user) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    await user.removeRefreshToken(refreshToken);

    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.set("refreshToken", "", { maxAge: 0, httpOnly: true });
    response.cookies.set("accessToken", "", { maxAge: 0, httpOnly: true });
    response.cookies.set("csrfToken", "", { maxAge: 0, httpOnly: false });

    return response;

})
