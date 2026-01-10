import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { LoginFormData, loginSchema } from "@/shared/schemas/loginSchema";
import { getSafeUser } from "@/utils/getSafeUser";
import { setAccessAndRefreshTokens } from "@/utils/setAccessAndRefreshTokens";
import { validateRequest } from "@/utils/validateRequest";
import { handleApiErrors } from "@/utils/handleApiErrors";

export const POST = handleApiErrors(async function (req: NextRequest) {
    await dbConnect();

    const body = await req.json();

    const validatedData: LoginFormData = validateRequest(body, loginSchema);

    const { email, password } = validatedData;


    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    await user.populate("role");

    const response = NextResponse.json({
        message: "User logged in successfully",
        user: getSafeUser(user),
    });

    const tokens = {
        accessToken: user.generateAccessToken(),
        refreshToken: await user.generateRefreshToken(),
    };
    await setAccessAndRefreshTokens(response, tokens);

    return response;


})