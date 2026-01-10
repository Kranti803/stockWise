import { NextResponse } from "next/server";

export const handleApiErrors = (handler: (...args: any[]) => Promise<NextResponse> | NextResponse) => {
    return async (...args: any[]) => {
        try {
            const response = await handler(...args);
            return response;
        } catch (error) {

            if (error instanceof Error) {
                try {
                    const parsed = JSON.parse(error.message);
                    return NextResponse.json({ errors: parsed }, { status: 400 });
                } catch {
                    return NextResponse.json({ message: error.message }, { status: 400 });
                }
            }

            return NextResponse.json(
                { message: "Internal server error" },
                { status: 500 }
            );
        }

    }
}