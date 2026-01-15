import { NextResponse } from "next/server";

// Custom API Error class
export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

// API error wrapper
export const handleApiErrors = (
    handler: (...args: any[]) => Promise<NextResponse> | NextResponse
) => {
    return async (...args: any[]) => {
        try {
            return await handler(...args);
        } catch (error: any) {
            // custom ApiError, return its status and message
            if (error instanceof ApiError) {
                return NextResponse.json(
                    { success: false, message: error.message },
                    { status: error.status }
                );
            }

            if (error instanceof Error) {
                try {
                    const parsed = JSON.parse(error.message);
                    return NextResponse.json(
                        { success: false, message: "Validation failed", errors: parsed },
                        { status: 400 }
                    );
                } catch {
                    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
                }
            }

            // Fallback for unexpected errors
            return NextResponse.json(
                { success: false, message: "Internal server error" },
                { status: 500 }
            );
        }
    }
};
