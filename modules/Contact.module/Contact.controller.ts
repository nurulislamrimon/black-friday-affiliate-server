import { NextFunction, Request, Response } from "express";
import * as ContactServices from "./Contact.services";
import { getUserByEmailService } from "../user.module/user.services";
import catchAsync from "../../Shared/catchAsync";

// get Contact controller
export const getContactController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ContactServices.getContactService("-updateBy -postBy");
    res.send({
      success: true,
      data: result,
    });
    console.log(`Contact ${result?._id} is added!`);
  }
);
// add new Contact controller
export const addNewContactController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { contact } = req.body;

    if (!contact) {
      throw new Error("Please enter required information!");
    } else {
      const isAContactExist = (await ContactServices.getContactService(
        ""
      )) as any;
      if (isAContactExist) {
        await ContactServices.updateActiveContactToInactiveService();
      }
      const postBy = await getUserByEmailService(req.body.decoded.email);

      const result = await ContactServices.addNewContactService({
        ...req.body,
        postBy: {
          ...postBy?.toObject(),
          moreAboutUser: postBy?._id,
        },
      });
      res.send({
        success: true,
        data: result,
      });
      console.log(`Contact ${result?._id} is added!`);
    }
  }
);
