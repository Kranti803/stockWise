import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { LoginFormData, loginSchema } from "@/schemas/loginSchema";
import "@/models/Roles";
import { getSafeUser } from "@/utils/getSafeUser";
import { setAccessAndRefreshTokens } from "@/utils/setAccessAndRefreshTokens";
import { validateRequest } from "@/utils/validateRequest";
import { handleApiErrors, ApiError } from "@/utils/handleApiErrors";

export const POST = handleApiErrors(async function (req: NextRequest) {
    await dbConnect();

    const body = await req.json();


    const validatedData: LoginFormData = validateRequest(body, loginSchema);
    console.log(validatedData);

    const { email, password } = validatedData;


    const user = await User.findOne({ email }).populate("role");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const tokens = {
        accessToken: user.generateAccessToken(),
        refreshToken: await user.generateRefreshToken(),
    };

    const csrfToken = crypto.randomBytes(32).toString("hex");

    const response = NextResponse.json({
        success: true,
        message: "User logged in successfully",
        data: {
            user: getSafeUser(user),
            csrfToken,
        },
    });

    await setAccessAndRefreshTokens(response, tokens, csrfToken);

    return response;


})