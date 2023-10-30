import { NextFunction, Request, Response } from "express";
import * as BrandServices from "./brand.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import { getPostByBrandIdService } from "../post.module/post.services";

// get Brand by Id controller
export const getABrandController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const BrandId = new Types.ObjectId(req.params.id);

    const result = await BrandServices.getBrandByIdService(BrandId);
    if (!result) {
      throw new Error("Brand not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};
// get Brand by Id controller
export const getABrandByBrandNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const BrandName = req.params.BrandName;

    const result = await BrandServices.getBrandByBrandNameService(BrandName);
    if (!result) {
      throw new Error("Brand not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    next(error);
  }
};
// get all active Brands
export const getAllActiveBrandsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BrandServices.getAllActiveBrands(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Brands are responsed!`);
  } catch (error) {
    next(error);
  }
};
// add new Brand controller
export const addNewBrandController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { brandPhotoURL, brandName, countries } = req.body;
    const existBrand = await BrandServices.getBrandByBrandNameService(
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

      const result = await BrandServices.addNewBrandService({
        ...req.body,
        postBy: { ...postBy?.toObject(), moreAboutUser: postBy?._id },
      });
      res.send({
        success: true,
        data: result,
      });
      console.log(`Brand ${result} is added!`);
    }
  } catch (error) {
    next(error);
  }
};
// get all Brands
export const getAllBrandsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BrandServices.getAllBrands(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Brands are responsed!`);
  } catch (error) {
    next(error);
  }
};
// update a Brand controller
export const updateABrandController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = new Types.ObjectId(req.params.id);
    const existBrand = await BrandServices.getBrandByIdService(postId);

    if (!existBrand) {
      throw new Error("Brand doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);
      const result = await BrandServices.updateABrandService(postId, {
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
  } catch (error) {
    next(error);
  }
};
// update a Brand controller
export const deleteABrandController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const BrandId = new Types.ObjectId(req.params.id);
    const existBrand = await BrandServices.getBrandByIdService(BrandId);

    const isRelatedPostExist = await getPostByBrandIdService(BrandId);

    if (!existBrand) {
      throw new Error("Brand doesn't exist!");
    } else if (isRelatedPostExist.length) {
      throw new Error(
        "Sorry! This Brand has some posts, You can't delete the Brand!"
      );
    } else {
      const result = await BrandServices.deleteABrandService(BrandId);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Brand ${result} is added!`);
    }
  } catch (error) {
    next(error);
  }
};
