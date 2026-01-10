import { ZodError } from "zod";

export const parseZodErrors = (error: unknown) => {
  const fieldErrors: Record<string, string> = {};

  if (error instanceof ZodError) {
    console.log(error.issues)
    error.issues.forEach((issue) => {
      const field = issue.path.join(".") || "form"; // supports nested fields
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message; // first error per field
      }
    });
  }

  return fieldErrors;
};
