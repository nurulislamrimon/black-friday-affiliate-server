import { NextFunction, Request, Response } from "express";
import { error_code_from_message } from "../utils/error_codes_from_message";
import colors from "@colors/colors";

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
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    throw new Error("Something went wrong!");
  } else {
    if (typeof err === "string") {
      res.status(error_code_from_message(err)).send({
        success: false,
        message: err,
        stack: process.env.NODE_ENV !== "development" ? "" : err,
      });
      console.log(colors.red(err));
    } else if (err) {
      res.status(error_code_from_message(err.message)).send({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV !== "development" ? "" : err?.stack,
      });

      console.log(colors.red(err.message));
    } else {
      res.send({
        success: false,
        message: "Internal server error!",
      });
      console.log(colors.red(err));
    }
  }
};
