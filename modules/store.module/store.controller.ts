import { NextFunction, Request, Response } from "express";
import * as storeServices from "./store.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import { getPostByStoreIdService } from "../post.module/post.services";

// get store by Id controller
export const getAStoreController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
// get store by Id controller
export const getAStoreByStoreNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
// get all active stores
export const getAllActiveStoresController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await storeServices.getAllActiveStores(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} stores are responsed!`);
  } catch (error) {
    next(error);
  }
};
// add new store controller
export const addNewStoreController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { storeName, storePhotoURL, storeLink, countries } = req.body;
    const existStore = await storeServices.getStoreByStoreNameService(
      storeName
    );

    if (!storeName || !storePhotoURL || !storeLink || !countries) {
      throw new Error("Please enter required information!");
    } else if (existStore?.storeName === storeName) {
      throw new Error("Store already exist!");
    } else {
      const postBy = await getUserByEmailService(req.body.decoded.email);

      const result = await storeServices.addNewStoreService({
        ...req.body,
        postBy: { ...postBy?.toObject(), moreAboutUser: postBy?._id },
      });
      res.send({
        success: true,
        data: result,
      });
      console.log(`Store ${result._id} is added!`);
    }
  } catch (error) {
    next(error);
  }
};
// get all stores
export const getAllStoresController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await storeServices.getAllStores(req.query);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} stores are responsed!`);
  } catch (error) {
    next(error);
  }
};
// update a store controller
export const updateAStoreController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = new Types.ObjectId(req.params.id);
    const existStore = await storeServices.getStoreByIdService(postId);

    if (!existStore) {
      throw new Error("Store doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);
      const result = await storeServices.updateAStoreService(postId, {
        ...req.body,
        existStore,
        updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
      });

      res.send({
        success: true,
        data: result,
      });
      console.log(`Store ${result} is added!`);
    }
  } catch (error) {
    next(error);
  }
};
// update a store controller
export const deleteAStoreController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
