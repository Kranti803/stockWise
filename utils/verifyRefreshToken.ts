import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { SafeUser } from "@/types/common/safeUser";
import { getSafeUser } from "./getSafeUser";

export type AuthResult =
    | { success: true; user: any }
    | { success: false; message: "NO_TOKEN" | "ACCESS_TOKEN_EXPIRED" | "INVALID_TOKEN" | "FORBIDDEN" | "NO_PERMISSION_FOR_THIS_ACTION" };

export const verifyAccessToken = async (
    req: NextRequest,
    requiredPermissions: string[] = []
): Promise<AuthResult> => {
    await dbConnect();

    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
        return { success: false, message: "NO_TOKEN" };
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as any;

        const user = await User.findById(decodedToken.id).populate("role");

        if (!user || !user.isActive) {
            return { success: false, message: "FORBIDDEN" };
        }

        // Permission guard
        if (requiredPermissions.length) {
            const rolePerms = user.role?.permissions || [];
            const hasPermission = requiredPermissions.every((perm) => rolePerms.includes(perm));

            if (!hasPermission) {
                return { success: false, message: "NO_PERMISSION_FOR_THIS_ACTION" };
            }
        }

        return { success: true, user: getSafeUser(user) };
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            return { success: false, message: "ACCESS_TOKEN_EXPIRED" };
        }
        return { success: false, message: "INVALID_TOKEN" };
    }
};
