import { NextFunction, Request, Response } from "express";
import * as carouselServices from "./carousel.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import catchAsync from "../../Shared/catchAsync";

// get carousel controller
export const getCarouselController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await carouselServices.getCarouselService(
      "-updateBy -postBy"
    );
    res.send({
      success: true,
      data: result,
    });
    console.log(`carousel ${result?._id} is added!`);
  }
);
// add new carousel controller
export const addNewCarouselController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { carousel } = req.body;

    if (!carousel) {
      throw new Error("Please enter required information!");
    } else {
      const isACarouselExist = (await carouselServices.getCarouselService(
        ""
      )) as any;
      let result;
      if (!isACarouselExist) {
        const postBy = await getUserByEmailService(req.body.decoded.email);

        result = await carouselServices.addNewCarouselService({
          ...req.body,
          postBy: {
            ...postBy?.toObject(),
            moreAboutUser: postBy?._id,
          },
        });
      } else {
        const id = new Types.ObjectId(isACarouselExist?._id);

        const updateBy = await getUserByEmailService(req.body.decoded.email);
        result = await carouselServices.updateCarouselByIdService(id, {
          ...req.body,
          updateBy: {
            ...updateBy?.toObject(),
            moreAboutUser: updateBy?._id,
          },
        });
      }
      res.send({
        success: true,
        data: result,
      });
      console.log(`carousel ${result?._id} is added!`);
    }
  }
);
