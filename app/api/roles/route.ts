import { handleApiErrors } from "@/utils/handleApiErrors";
import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Role from "@/models/Roles";
import { validateRequest } from "@/utils/validateRequest";
import { RoleSchema, roleSchema } from "@/schemas/roleSchema";
//get all roles
export const GET = handleApiErrors(async function (req: NextRequest) {
    await dbConnect();
    const roles = await Role.find();
    return NextResponse.json({ roles });
});

//add a role
export const POST = handleApiErrors(async function (req: NextRequest) {

    await dbConnect();

    const body = await req.json();
    const validatedData: RoleSchema = validateRequest(body, roleSchema);

    const { name, permissions, description } = validatedData;

    const role = await Role.create({ name, permissions, description });

    return NextResponse.json({ role });
});

