import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/verifyRefreshToken";
import { SafeUser } from "@/types/common/safeUser";

export const handleAuth = (
    handler: (req: NextRequest, user: SafeUser) => Promise<NextResponse> | NextResponse,
    requiredPermissions: string[] = []
) => {
    return async (req: NextRequest) => {
        // Verify access token and permissions
        const result = await verifyAccessToken(req, requiredPermissions);

        if (!result.success) {
            let status = 401;
            if (result.message === "FORBIDDEN" || result.message === "NO_PERMISSION_FOR_THIS_ACTION") status = 403;
            return NextResponse.json({ success: false, message: result.message }, { status });
        }

        // Calling the actual route handler with the authenticated user
        return handler(req, result.user);
    };
};
