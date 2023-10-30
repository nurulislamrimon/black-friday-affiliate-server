import { NextFunction, Request, Response } from "express";
import * as administratorsServices from "./administrators.services";
import { Types } from "mongoose";
import { roles } from "../../utils/constants/authorization_roles";

export const addNewAdministratorController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const existAdministrator =
      await administratorsServices.getAdministratorsByEmailService(email);
    if (existAdministrator) {
      throw new Error("Administrator already exist!");
    }
    const newAdministrator =
      await administratorsServices.addNewAdministratorsService(req.body);

    res.send({
      success: true,
      data: newAdministrator,
    });
    console.log(`user ${newAdministrator._id} is responsed!`);
  } catch (error) {
    next(error);
  }
};

// // get all admin and managers
export const getAllAdminAndManagerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await administratorsServices.getAllAdminAndManagerService(
      req.query
    );
    res.send({
      success: true,
      ...result,
    });
    console.log(`Administrators ${result?.data?.length} are responsed!`);
  } catch (error) {
    next(error);
  }
};

// // get all admin and managers
export const getMeAdminAndManagerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await administratorsServices.getMeAdminAndManagerService(
      req.body.decoded.email
    );
    res.send({
      success: true,
      data: result,
    });
    console.log(`Administrator is responsed!`);
  } catch (error) {
    next(error);
  }
};

//update an administrator
export const updateAdministratorController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetedAdministratorId = new Types.ObjectId(req.params.id);
    const targetedAdministrator =
      (await administratorsServices.getAdministratorsByIdService(
        targetedAdministratorId
      )) as any;
    const operatedAdministrator =
      (await administratorsServices.getAdministratorsByEmailService(
        req.body.decoded.email
      )) as any;
    if (!targetedAdministrator) {
      throw new Error("Administrator not found!");
    } else if (
      operatedAdministrator.role !== roles.SUPER_ADMIN &&
      targetedAdministrator.role === roles.SUPER_ADMIN
    ) {
      throw new Error("Unauthorized access!");
    } else {
      const result = await administratorsServices.updateAdministratorService(
        targetedAdministratorId,
        req.body.role
      );
      res.send({
        success: true,
        data: result,
      });
      console.log(`Administrator is updated!`);
    }
  } catch (error) {
    next(error);
  }
};

//update an administrator
export const deleteAdministratorController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetedAdministratorId = new Types.ObjectId(req.params.id);
    const targetedAdministrator =
      (await administratorsServices.getAdministratorsByIdService(
        targetedAdministratorId
      )) as any;
    const operatedAdministrator =
      (await administratorsServices.getAdministratorsByEmailService(
        req.body.decoded.email
      )) as any;
    const isMemberLoggedIn =
      await administratorsServices.getMeAdminAndManagerService(
        targetedAdministrator.email
      );
    if (!targetedAdministrator) {
      throw new Error("Administrator not found!");
    } else if (isMemberLoggedIn) {
      throw new Error("Sorry User already logged once!");
    } else {
      const result = await administratorsServices.deleteAdministratorService(
        targetedAdministratorId
      );
      res.send({
        success: true,
        data: result,
      });
      console.log(`Administrator is delete!`);
    }
  } catch (error) {
    next(error);
  }
};
