import { NextFunction, Request, Response } from "express";
import * as PostServices from "./post.services";
import { getUserByEmailService } from "../user.module/user.services";
import { Types } from "mongoose";
import { getStoreByStoreNameService } from "../store.module/store.services";
import { getBrandByBrandNameService } from "../brand.module/brand.services";
import { getCategoryByCategoryNameService } from "../category.module/category.services";
import { getCampaignByCampaignNameService } from "../campaign.module/campaign.services";
import { getNetworkByNetworkNameService } from "../network.module/network.services";

// add new Post controller
export const addNewPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      postTitle,
      storeName,
      brandName,
      categoryName,
      campaignName,
      networkName,
      expireDate,
      countries,
      postType,
    } = req.body;

    if (
      !postTitle ||
      !storeName ||
      !brandName ||
      !categoryName ||
      !campaignName ||
      !expireDate ||
      !countries ||
      !postType
    ) {
      throw new Error(
        "Please enter required information:  postTitle, storeName, brandName, categoryName, campaignName, expireDate, countries, postType!"
      );
    } else {
      const postBy = await getUserByEmailService(req.body.decoded.email);
      const isStoreExist = await getStoreByStoreNameService(storeName);
      const isBrandExist = await getBrandByBrandNameService(brandName);
      const isCategoryExist = await getCategoryByCategoryNameService(
        categoryName
      );
      const isCampaignExist = await getCampaignByCampaignNameService(
        campaignName
      );

      if (!isStoreExist) {
        throw new Error("Invalid store name!");
      } else if (!isBrandExist) {
        throw new Error("Invalid brand name!");
      } else if (!isCategoryExist) {
        throw new Error("Invalid category name!");
      } else if (!isCampaignExist) {
        throw new Error("Invalid Campaign name!");
      } else {
        const newPost = {
          ...req.body,
          store: isStoreExist._id,
          brand: isBrandExist._id,
          category: isCategoryExist._id,
          campaign: isCampaignExist._id,
          postBy: { ...postBy?.toObject(), moreAboutUser: postBy?._id },
        };
        if (networkName) {
          const isNetworkExist = await getNetworkByNetworkNameService(
            networkName
          );
          if (!isNetworkExist) {
            throw new Error("Invalid network name!");
          } else {
            newPost.network = isNetworkExist._id;
          }
        }
        const result = await PostServices.addNewPostService(newPost);
        res.send({
          success: true,
          data: result,
        });
        console.log(`Post ${result._id} is added!`);
      }
    }
  } catch (error) {
    next(error);
  }
};

// add new Post controller
export const searchGloballyClientController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PostServices.searchGloballyClientService(req.query);
    res.send({
      success: true,
      data: result,
    });
    console.log(`global search is responsed!`);
  } catch (error) {
    next(error);
  }
};
export const searchGloballyAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PostServices.searchGloballyAdminService(req.query);
    res.send({
      success: true,
      data: result,
    });
    console.log(`global search is responsed!`);
  } catch (error) {
    next(error);
  }
};
// get a Post controller
export const getAPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// get all Posts
export const getAllPostsByAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PostServices.getAllPosts(req.query, false);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Posts are responsed!`);
  } catch (error) {
    next(error);
  }
};

// get all active Posts
export const getAllActivePostsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PostServices.getAllPosts(req.query, true);
    res.send({
      success: true,
      ...result,
    });
    console.log(`${result?.data?.length} Posts are responsed!`);
  } catch (error) {
    next(error);
  }
};

// update a Post controller
export const updateAPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = new Types.ObjectId(req.params.id);
    const existPost = await PostServices.getPostByIdService(postId);

    if (!existPost) {
      throw new Error("Post doesn't exist!");
    } else {
      const updateBy = await getUserByEmailService(req.body.decoded.email);
      const result = await PostServices.updateAPostService(postId, {
        ...req.body,
        existPost,
        updateBy: { ...updateBy?.toObject(), moreAboutUser: updateBy?._id },
      });

      res.send({
        success: true,
        data: result,
      });
      console.log(`Post ${result} is added!`);
    }
  } catch (error) {
    next(error);
  }
};

// revealed a Post controller
export const revealedAPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// update a Post controller
export const deleteAPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
// update a Post controller
export const deleteManyPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
