import { NextFunction, Request, Response } from "express";
import * as CategoryServices from "./category.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import { getPostByCategoryIdService } from "../post.module/post.services";
import catchAsync from "../../Shared/catchAsync";

// get Category by Id controller
export const getACategoryByCategoryNameController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryName = req.params.categoryName;

    const result = await CategoryServices.getCategoryByCategoryNameService(
      categoryName
    );
    if (!result) {
      throw new Error("Category not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  }
);

// get Category by Id controller
export const getACategoryByIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const CategoryId = new Types.ObjectId(req.params.id);

    const result = await CategoryServices.getCategoryByIdService(CategoryId);
    if (!result) {
      throw new Error("Category not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  }
);

// add new Category controller
export const addNewCategoryController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryName } = req.body;
    const existCategory =
      await CategoryServices.getCategoryByCategoryNameService(categoryName);

    if (!categoryName) {
      throw new Error("Please enter required information: categoryName!");
    } else if (existCategory?.categoryName === categoryName) {
      throw new Error("Category already exist!");
    } else {
      const postBy = await getUserByEmailService(req.body.decoded.email);

      const result = await CategoryServices.addNewCategoryService({
        ...req.body,
        postBy: { ...postBy?.toObject(), moreAboutUser: postBy?._id },
      });
      res.send({
        success: true,
        data: result,
      });
      console.log(`Category ${result._id} is added!`);
    }
  }
);

// get all Categorys
export const getAllCategorysController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await CategoryServices.getAllCategorys(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Categorys are responsed!`);
  }
);

// update a Category controller
export const updateACategoryController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = new Types.ObjectId(req.params.id);
    const existCategory = await CategoryServices.getCategoryByIdService(postId);

    if (!existCategory) {
      throw new Error("Category doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);
      const result = await CategoryServices.updateACategoryService(postId, {
        ...req.body,
        existCategory,
        updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
      });

      res.send({
        success: true,
        data: result,
      });
      console.log(`Category ${result} is added!`);
    }
  }
);

// update a Category controller
export const deleteACategoryController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const CategoryId = new Types.ObjectId(req.params.id);
    const existCategory = await CategoryServices.getCategoryByIdService(
      CategoryId
    );

    const isRelatedPostExist = await getPostByCategoryIdService(CategoryId);

    if (!existCategory) {
      throw new Error("Category doesn't exist!");
    } else if (isRelatedPostExist.length) {
      throw new Error(
        "Sorry! This Category has some posts, You can't delete the Category!"
      );
    } else {
      const result = await CategoryServices.deleteACategoryService(CategoryId);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Category ${result} is added!`);
    }
  }
);
