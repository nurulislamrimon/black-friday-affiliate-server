import { NextFunction, Request, Response } from "express";
import * as storeServices from "./store.services";
import { getUserByEmailService } from "../user.module/user.services";
import mongoose, { Types } from "mongoose";
import { getPostByStoreIdService } from "../post.module/post.services";
import catchAsync from "../../Shared/catchAsync";

// add new store controller
export const addNewStoreController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { storeName, storePhotoURL, storeLink } = req.body;
    const existStore = await storeServices.getStoreByStoreNameService(
      storeName
    );

    if (!storeName || !storePhotoURL || !storeLink) {
      res.status(400).json({
        success: false,
        error: "Please enter required information!",
      });
    } else if (existStore?.storeName === storeName) {
      res.status(400).json({
        success: false,
        error: "Store already exists!",
      });
    } else {
      const postBy = await getUserByEmailService(req.body.decoded.email);

      const result = await storeServices.addNewStoreService({
        ...req.body,
        postBy: { ...postBy?.toObject(), moreAboutUser: postBy?._id },
      });

      res.status(201).json({
        success: true,
        data: result,
      });
      console.log(`Store ${result._id} is added!`);
    }
  }
);

// get store by Id controller
export const getAStoreController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = new Types.ObjectId(req.params.id);

    const result = await storeServices.getStoreByIdService(storeId);
    if (!result) {
      throw new Error("Store not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  }
);

// get store by Id controller
export const getAStoreByStoreNameController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeName = req.params.storeName;

    const result = await storeServices.getStoreByStoreNameService(storeName);
    if (!result) {
      throw new Error("Store not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
    }
  }
);

// get all active stores
export const getAllStoresClientController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await storeServices.getAllStores(req.query, false);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} stores are responsed!`);
  }
);

// get all stores
export const getAllStoresAdminController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await storeServices.getAllStores(req.query, true);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} stores are responsed!`);
  }
);

// update a store controller
export const updateAStoreController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { storeName, storePhotoURL } = req.body;
    const storeId = new Types.ObjectId(req.params.id);
    const existStore = await storeServices.getStoreByIdService(storeId);

    if (!existStore) {
      throw new Error("Store doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);

      const session = await mongoose.startSession();

      session.startTransaction();
      try {
        // update the store
        const result = await storeServices.updateAStoreService(
          storeId,
          {
            ...req.body,
            existStore,
            updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
          },
          session
        );
        // update all posts that uses refference of the store
        if (storeName || storePhotoURL) {
          await storeServices.updateRefferencePosts(storeId, result, session);
        }

        res.send({
          success: true,
          data: result,
        });
        console.log(`Store is updated!`);
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

// update a store controller
export const deleteAStoreController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const storeId = new Types.ObjectId(req.params.id);
    const existStore = await storeServices.getStoreByIdService(storeId);

    const isRelatedPostExist = await getPostByStoreIdService(storeId);

    if (!existStore) {
      throw new Error("Store doesn't exist!");
    } else if (isRelatedPostExist.length) {
      throw new Error(
        "Sorry! This store has some posts, You can't delete the store!"
      );
    } else {
      const result = await storeServices.deleteAStoreService(storeId);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Store ${result} is added!`);
    }
  }
);
