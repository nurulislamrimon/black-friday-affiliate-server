import { NextFunction, Request, Response } from "express";
import * as brandServices from "./brand.services";
import { getUserByEmailService } from "../user.module/user.services";
import mongoose, { Types } from "mongoose";
import { getPostByBrandIdService } from "../post.module/post.services";
import catchAsync from "../../Shared/catchAsync";

// get Brand by Id controller
export const getBrandByIdController = catchAsync(
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

// get all Brands
export const getAllBrandsAdminController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await brandServices.getAllBrands(req.query, true);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Brands are responsed!`);
  }
);

// get all active Brands
export const getAllBrandsClientController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await brandServices.getAllBrands(req.query, false);
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
    const { brandPhotoURL, brandName } = req.body;
    const existBrand = await brandServices.getBrandByBrandNameService(
      brandName
    );

    if (!brandPhotoURL || !brandName) {
      throw new Error(
        "Please enter required information: brandPhotoURL, brandName!"
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

// update a brand
export const updateABrandController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { brandName, brandPhotoURL } = req.body;
    const brandId = new Types.ObjectId(req.params.id);
    const existBrand = await brandServices.getBrandByIdService(brandId);

    if (!existBrand) {
      throw new Error("Brand doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);

      const session = await mongoose.startSession();

      session.startTransaction();
      try {
        // update the brand
        const result = await brandServices.updateABrandService(
          brandId,
          {
            ...req.body,
            existBrand: existBrand,
            updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
          },
          session
        );
        // update all posts that uses refference of the brand
        if (brandName || brandPhotoURL) {
          await brandServices.updateRefferencePosts(brandId, result, session);
        }

        res.send({
          success: true,
          data: result,
        });
        console.log(`brand is updated!`);
        await session.commitTransaction();
      } catch (error) {
        session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
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
