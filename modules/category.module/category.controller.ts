import { NextFunction, Request, Response } from "express";
import * as CategoryServices from "./category.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import { getPostByCategoryIdService } from "../post.module/post.services";

// get Category by Id controller
export const getACategoryByCategoryNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// get Category by Id controller
export const getACategoryByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// add new Category controller
export const addNewCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// get all Categorys
export const getAllCategorysController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await CategoryServices.getAllCategorys(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Categorys are responsed!`);
  } catch (error) {
    next(error);
  }
};

// update a Category controller
export const updateACategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// update a Category controller
export const deleteACategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
