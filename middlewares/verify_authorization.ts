import { NextFunction, Request } from "express";
import { getAdministratorsByEmailService } from "../modules/administrators.module/administrators.services";

export const verify_authorization = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.body.decoded.email;
      const administrator = (await getAdministratorsByEmailService(
        email
      )) as any;

      if (!administrator) {
        next("Unauthorized access!");
      } else if (roles.includes(administrator?.role)) {
        next();
      } else {
        throw new Error("Unauthorized access!");
      }
    } catch (error) {
      next(error);
    }
  };
};
