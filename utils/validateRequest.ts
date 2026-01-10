import { NextRequest, NextResponse } from "next/server";
import { parseZodErrors } from "./parseZodErrors";

export const validateRequest = (body: any, schema: any) => {
    const result = schema.safeParse(body);
    if (!result.success) {

        const formatted = parseZodErrors(result.error);
        throw new Error(JSON.stringify(formatted));
    }
    return result.data;
}
