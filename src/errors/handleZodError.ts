import { ZodError, ZodIssue } from "zod";
import httpStatus from "http-status";

const handleZodError = (error: ZodError) => {
  const errors = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: "Validation Error",
    errors,
  };
};

export default handleZodError;
