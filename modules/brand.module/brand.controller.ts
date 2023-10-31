import { NextFunction, Request, Response } from "express";
import * as brandServices from "./brand.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import { getPostByBrandIdService } from "../post.module/post.services";
import catchAsync from "../../Shared/catchAsync";

// get Brand by Id controller
export const getABrandController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const BrandId = new Types.ObjectId(req.params.id);

    const result = await brandServices.getBrandByIdService(BrandId);
    if (!result) {
      throw new Error("Brand not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  }
);
// get Brand by Id controller
export const getABrandByBrandNameController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const BrandName = req.params.BrandName;

    const result = await brandServices.getBrandByBrandNameService(BrandName);
    if (!result) {
      throw new Error("Brand not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  }
);
// get all active Brands
export const getAllActiveBrandsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await brandServices.getAllActiveBrands(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Brands are responsed!`);
  }
);
// add new Brand controller
export const addNewBrandController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { brandPhotoURL, brandName, countries } = req.body;
    const existBrand = await brandServices.getBrandByBrandNameService(
      brandName
    );

    if (!brandPhotoURL || !brandName || !countries) {
      throw new Error(
        "Please enter required information: brandPhotoURL, brandName, countries!"
      );
    } else if (existBrand?.brandName === brandName) {
      throw new Error("Brand already exist!");
    } else {
      const postBy = await getUserByEmailService(req.body.decoded.email);

      const result = await brandServices.addNewBrandService({
        ...req.body,
        postBy: { ...postBy?.toObject(), moreAboutUser: postBy?._id },
      });
      res.send({
        success: true,
        data: result,
      });
      console.log(`Brand ${result._id} is added!`);
    }
  }
);
// get all Brands
export const getAllBrandsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await brandServices.getAllBrands(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Brands are responsed!`);
  }
);
// update a Brand controller
export const updateABrandController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = new Types.ObjectId(req.params.id);
    const existBrand = await brandServices.getBrandByIdService(postId);

    if (!existBrand) {
      throw new Error("Brand doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);
      const result = await brandServices.updateABrandService(postId, {
        ...req.body,
        existBrand,
        updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
      });

      res.send({
        success: true,
        data: result,
      });
      console.log(`Brand ${result} is added!`);
    }
  }
);
// update a Brand controller
export const deleteABrandController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const BrandId = new Types.ObjectId(req.params.id);
    const existBrand = await brandServices.getBrandByIdService(BrandId);

    const isRelatedPostExist = await getPostByBrandIdService(BrandId);

    if (!existBrand) {
      throw new Error("Brand doesn't exist!");
    } else if (isRelatedPostExist.length) {
      throw new Error(
        "Sorry! This Brand has some posts, You can't delete the Brand!"
      );
    } else {
      const result = await brandServices.deleteABrandService(BrandId);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Brand ${result} is added!`);
    }
  }
);
