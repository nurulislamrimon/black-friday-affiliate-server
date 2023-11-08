import { NextFunction, Request, Response } from "express";
import * as PostServices from "./post.services";
import { getUserByEmailService } from "../user.module/user.services";
import mongoose, { Types } from "mongoose";
import catchAsync from "../../Shared/catchAsync";
import { getStoreByStoreNameService } from "../store.module/store.services";
import { checkIsExistAndAddFields } from "../../utils/checkIsExistAndGetFields";
import { getBrandByBrandNameService } from "../brand.module/brand.services";
import { getCategoryByCategoryNameService } from "../category.module/category.services";
import { getCampaignByCampaignNameService } from "../campaign.module/campaign.services";
import { getNetworkByNetworkNameService } from "../network.module/network.services";

// add new Post controller
export const addNewPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postTitle, expireDate, countries, postType } = req.body;

    if (!postTitle || !expireDate || !countries || !postType) {
      throw new Error(
        "Please enter required information:  postTitle, expireDate, countries, postType!"
      );
    } else {
      const postBy = await getUserByEmailService(req.body.decoded.email);

      const newPost = {
        ...req.body,
        store: { storeName: req.body.storeName },
        brand: { brandName: req.body.brandName },
        category: { categoryName: req.body.categoryName },
        network: { networkName: req.body.networkName },
        campaign: { campaignName: req.body.campaignName },
        postBy: { ...postBy?.toObject(), moreAboutUser: postBy?._id },
      };
      // const session = await mongoose.startSession();
      // session.startTransaction();
      // try {
      const result = await PostServices.addNewPostService(newPost);
      // if (result) {
      // await PostServices.createNewPostUpdateCountriesToAllRelatedFields(
      //     result,
      //     session
      //   );
      // }

      res.send({
        success: true,
        data: result,
      });
      console.log(`Post is added!`);
      //   await session.commitTransaction();
      // } catch (error) {
      //   session.abortTransaction();
      //   throw error;
      // } finally {
      //   session.endSession();
      // }
    }
  }
);

// add new Post controller
export const searchGloballyClientController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostServices.searchGloballyClientService(req.query);
    res.send({
      success: true,
      data: result,
    });
    console.log(`global search is responsed!`);
  }
);
export const searchGloballyAdminController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostServices.searchGloballyAdminService(req.query);
    res.send({
      success: true,
      data: result,
    });
    console.log(`global search is responsed!`);
  }
);
// get a Post controller
export const getAPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = new Types.ObjectId(req.params.id);
    const result = await PostServices.getPostByIdService(postId);
    if (!result) {
      throw new Error("Post not found!");
    } else {
      res.send({
        success: true,
        data: result,
      });
      console.log(`Post ${result._id} is added!`);
    }
  }
);

// get all Posts
export const getAllPostsByAdminController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostServices.getAllPosts(req.query, false);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Posts are responsed!`);
  }
);

// get all active Posts
export const getAllActivePostsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostServices.getAllPosts(req.query, true);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Posts are responsed!`);
  }
);

// update a Post controller
export const updateAPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      storeName,
      brandName,
      categoryName,
      campaignName,
      networkName,
      ...rest
    } = req.body;

    const postId = new Types.ObjectId(req.params.id);
    const existPost = await PostServices.getPostByIdService(postId);
    if (!existPost) {
      throw new Error("Post doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);
      const updateData = {
        ...rest,
        existPost,
        updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
      };

      await checkIsExistAndAddFields(
        "store",
        { storeName },
        getStoreByStoreNameService,
        updateData
      );
      await checkIsExistAndAddFields(
        "brand",
        { brandName },
        getBrandByBrandNameService,
        updateData
      );
      await checkIsExistAndAddFields(
        "category",
        { categoryName },
        getCategoryByCategoryNameService,
        updateData
      );
      await checkIsExistAndAddFields(
        "campaign",
        { campaignName },
        getCampaignByCampaignNameService,
        updateData
      );
      await checkIsExistAndAddFields(
        "network",
        { networkName },
        getNetworkByNetworkNameService,
        updateData
      );

      const result = await PostServices.updateAPostService(postId, updateData);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Post is updated!`);
    }
  }
);

// revealed a Post controller
export const revealedAPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = new Types.ObjectId(req.params.id);
    const existPost = await PostServices.getPostByIdService(postId);

    if (!existPost) {
      throw new Error("Post doesn't exist!");
    } else {
      const result = await PostServices.revealedAPostService(postId);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Post ${result} is added!`);
    }
  }
);

// update a Post controller
export const deleteAPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = new Types.ObjectId(req.params.id);
    const existPost = await PostServices.getPostByIdService(postId);

    if (!existPost) {
      throw new Error("Post doesn't exist!");
    } else {
      const result = await PostServices.deleteAPostService(postId);

      res.send({
        success: true,
        data: result,
      });
      console.log(`Post ${result} is added!`);
    }
  }
);
// update a Post controller
export const deleteManyPostController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postIds = req.body.posts;
    if (!postIds) {
      throw new Error("posts are required!");
    }
    const result = await PostServices.deleteManyPostService(postIds);

    res.send({
      success: true,
      data: result,
    });
    console.log(`Post ${result} is added!`);
  }
);
