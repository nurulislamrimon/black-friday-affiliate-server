import { NextFunction, Request, Response } from "express";
import { getUserByEmailService } from "../modules/user.module/user.services";
import { getPayloadFromToken } from "../utils/get_payload_from_token";

export const verify_token = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new Error("Access Forbidden!");
    } else {
      const token = authorization.split(" ")[1];
      const payload = getPayloadFromToken(token);

      const email = payload.email;
      const user = await getUserByEmailService(email as string);
      if (!user?.isVerified) {
        throw new Error("Unauthorized access!");
      } else {
        req.body.decoded = payload;
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};
