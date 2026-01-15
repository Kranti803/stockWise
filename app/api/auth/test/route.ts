import { SafeUser } from "@/types/common/safeUser";
import { handleApiErrors } from "@/utils/handleApiErrors";
import { handleAuth } from "@/utils/handleAuth";
import { NextRequest, NextResponse } from "next/server";

export const GET = handleAuth(handleApiErrors(async (req: NextRequest, user: SafeUser) => {
    console.log("user from test route", user);
    return NextResponse.json({ user });
}));