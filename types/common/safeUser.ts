import { IRole } from "../roles";

export interface SafeUser {
    _id: string;
    name: string;
    email: string;
    role: IRole;
    isActive: boolean;
    lastLogin?: Date;
}