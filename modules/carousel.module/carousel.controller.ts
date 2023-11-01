import { NextFunction, Request, Response } from "express";
import * as carouselServices from "./carousel.services";
import { getUserByEmailService } from "../user.module/user.services";
import catchAsync from "../../Shared/catchAsync";
import { Types } from "mongoose";

// get carousel controller
export const getCarouselController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await carouselServices.getCarouselService();
    res.send({
      success: true,
      data: result,
    });
    console.log(`carousel ${result?.length} is added!`);
  }
);

// add new carousel controller
export const addNewCarouselController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { country, items } = req.body;

    if (!country || !items) {
      throw new Error("Please enter required information: country, items!");
    } else {
      const isACarouselExist =
        await carouselServices.getCarouselByCountryService(country);

      if (isACarouselExist) {
        throw new Error("Carousel already exist!");
      } else {
        const postBy = await getUserByEmailService(req.body.decoded.email);

        const result = await carouselServices.addNewCarouselService({
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
        console.log(`carousel ${result?._id} is added!`);
      }
    }
  }
);

// update carousel controller
export const updateCarouselController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const carouselId = new Types.ObjectId(req.params.id);
    const isCarouselExist = await carouselServices.getCarouselByIdService(
      carouselId
    );

    if (!isCarouselExist) {
      throw new Error("Carousel not found!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);
      const result = await carouselServices.updateCarouselByIdService(
        carouselId,
        {
          ...req.body,
          existCarousel: isCarouselExist,
          updateBy: {
            ...updateBy?.toObject(),
            moreAboutUser: updateBy?._id,
          },
        }
      );
      res.send({
        success: true,
        data: result,
      });
      console.log(`carousel is updated!`);
    }
  }
);

// delete carousel controller
export const deleteCarouselController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const carouselId = new Types.ObjectId(req.params.id);
    const isCarouselExist = await carouselServices.getCarouselByIdService(
      carouselId
    );

    if (!isCarouselExist) {
      throw new Error("Carousel not found!");
    } else {
      const result = await carouselServices.deleteCarouselService(carouselId);
      res.send({
        success: true,
        data: result,
      });
      console.log(`carousel is deleted!`);
    }
  }
);
