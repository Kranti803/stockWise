import { IUserDocument } from "@/models/User";

export const getSafeUser = (user: IUserDocument) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
});