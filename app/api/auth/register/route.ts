import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { registerBackendSchema } from "@/schemas/registerUserSchema";
import { getSafeUser } from "@/utils/getSafeUser";
import { setAccessAndRefreshTokens } from "@/utils/setAccessAndRefreshTokens";
import { validateRequest } from "@/utils/validateRequest";
import { RegisterBackendData } from "@/schemas/registerUserSchema";
import { handleApiErrors, ApiError } from "@/utils/handleApiErrors";
import Role from "@/models/Roles";
import crypto from "crypto";

export const POST = handleApiErrors(async function (req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const validatedData: RegisterBackendData = validateRequest(body, registerBackendSchema);

  const { name, email, password, role } = validatedData;


  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError(409, "Email already exists");
  }

  const roleName = role || "STAFF";
  const roleDoc = await Role.findOne({ name: roleName });

  if (!roleDoc) {
    throw new ApiError(400, "Invalid role");
  }
  const user = await User.create({
    name,
    email,
    password,
    role: roleDoc._id,
  });

  await user.populate("role");


  const tokens = {
    accessToken: user.generateAccessToken(),
    refreshToken: await user.generateRefreshToken(),
  };
  const csrfToken = crypto.randomBytes(32).toString("hex");

  const response = NextResponse.json({
    success: true,
    message: "User registered successfully",
    data: {
      user: getSafeUser(user),
      csrfToken,
    },
  });


  await setAccessAndRefreshTokens(response, tokens, csrfToken);

  return response;
});
