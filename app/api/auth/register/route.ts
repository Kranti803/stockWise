import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { registerBackendSchema } from "@/shared/schemas/registerUserSchema";
import { getSafeUser } from "@/utils/getSafeUser";
import { setAccessAndRefreshTokens } from "@/utils/setAccessAndRefreshTokens";
import { validateRequest } from "@/utils/validateRequest";
import { RegisterBackendData } from "@/shared/schemas/registerUserSchema";
import { handleApiErrors } from "@/utils/handleApiErrors";
import bcrypt from "bcryptjs";
import Role from "@/models/Roles";

export const POST = handleApiErrors(async function (req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const validatedData: RegisterBackendData = validateRequest(body, registerBackendSchema);

  const { name, email, password, role } = validatedData;


  const existing = await User.findOne({ email });

  if (existing) {
    return NextResponse.json({ message: "Email already exists" }, { status: 409 });
  }

  const roleName = role || "STAFF";
  const roleDoc = await Role.findOne({ name: roleName });

  if (!roleDoc) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }
  const user = await User.create({
    name,
    email,
    password,
    role: roleDoc._id,
  });

  await user.populate("role");

  const response = NextResponse.json({
    message: "User registered successfully",
    user: getSafeUser(user),
  });

  const tokens = {
    accessToken: user.generateAccessToken(),
    refreshToken: await user.generateRefreshToken(),
  };
  await setAccessAndRefreshTokens(response, tokens);

  return response;
});
