import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { error_code_from_message } from "../utils/error_codes_from_message";
import colors from "@colors/colors";
import mongooseType from "mongoose";
import { IGenericErrorMessage } from "../interfaces/error";
import handleValidationError from "../Errors/handleValidationError";
import handleCastError from "../Errors/castErrors";
import ApiError from "../Errors/ApiError";

export const routeNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send({
      success: false,
      message: "Route doesn't exist!",
    });
    console.log(colors.red("Route doesn't exist!"));
  } catch (error) {
    next(error);
  }
};

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  process.env.env === "development" &&
    console.log(`🐱‍🏍 globalErrorHandler ~~`, { error });

  let statusCode = 500;
  let message = "Something went wrong !";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: process.env.env !== "production" ? error?.stack : undefined,
  });
};
