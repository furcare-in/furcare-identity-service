import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import env from "../../utils/env.js";
import handleZodError from "../../errors/handleZodError.js";
import ApiError from "../../errors/ApiError.js";
import pkg from "@prisma/client";
const { Prisma } = pkg;

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.log("APP ERROR: ", { error });

  let statusCode = 500;
  let message = "Something went wrong !";
  let errors: unknown[] = [];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errors;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      //       code: 'P2002',
      // clientVersion: '5.20.0',
      // meta: { modelName: 'Staff', target: 'staffs_email_key' }
      case "P2002":
        message =
          (error.meta?.target + "").split("_").slice(0, -1).join(" ") +
          " must be unique";
        break;
      default:
        message = error.message;
    }
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error?.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length ? errors : undefined,
    stack: env.common.nodeEnv === "development" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
