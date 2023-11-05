import { NextFunction, Request, Response } from "express";
import * as categoryServices from "./category.services";
import { getUserByEmailService } from "../user.module/user.services";
import mongoose, { Types } from "mongoose";
import { getPostByCategoryIdService } from "../post.module/post.services";
import catchAsync from "../../Shared/catchAsync";

// get Category by Id controller
export const getACategoryByCategoryNameController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryName = req.params.categoryName;

    const result = await categoryServices.getCategoryByCategoryNameService(
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

    const result = await categoryServices.getCategoryByIdService(CategoryId);
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
      await categoryServices.getCategoryByCategoryNameService(categoryName);

    if (!categoryName) {
      throw new Error("Please enter required information: categoryName!");
    } else if (existCategory?.categoryName === categoryName) {
      throw new Error("Category already exist!");
    } else {
      const postBy = await getUserByEmailService(req.body.decoded.email);

      const result = await categoryServices.addNewCategoryService({
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
    const result = await categoryServices.getAllCategorys(req.query);
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
    const { categoryName } = req.body;
    const categoryId = new Types.ObjectId(req.params.id);
    const existCategory = await categoryServices.getCategoryByIdService(
      categoryId
    );

    if (!existCategory) {
      throw new Error("Category doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);

      const session = await mongoose.startSession();

      session.startTransaction();
      try {
        // update the category
        const result = await categoryServices.updateACategoryService(
          categoryId,
          {
            ...req.body,
            existCategory,
            updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
          },
          session
        );
        // update all posts that uses refference of the category
        if (categoryName) {
          await categoryServices.updateRefferencePosts(
            categoryId,
            result,
            session
          );
        }

        res.send({
          success: true,
          data: result,
        });
        console.log(`category is updated!`);
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

// Delete a Category controller
export const deleteACategoryController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const CategoryId = new Types.ObjectId(req.params.id);
    const existCategory = await categoryServices.getCategoryByIdService(
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
      const result = await categoryServices.deleteACategoryService(CategoryId);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Category ${result} is added!`);
    }
  }
);
