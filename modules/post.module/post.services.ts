import { Types } from "mongoose";
import Post from "./post.model";
import User from "../user.module/user.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { post_query_fields } from "../../utils/constants";
import {
  getAllActiveStores,
  getAllStores,
} from "../store.module/store.services";

//== get search client
export const searchGloballyClientService = async (query: object) => {
  const stores = await getAllActiveStores(query);
  const posts = await getAllPosts(query, true);
  return { stores, posts };
};
//== get search admin
export const searchGloballyAdminService = async (query: object) => {
  const stores = await getAllStores(query);
  const posts = await getAllPosts(query, false);
  return { stores, posts };
};
//== get Post by name
export const getPostByPostTitleService = async (postTitle: string) => {
  const result = await Post.findOne({ postTitle: postTitle }).populate(
    "store",
    {
      storeName: 1,
      photoURL: 1,
    }
  );
  return result;
};
//== get Post by store Id
export const getPostByStoreIdService = async (storeId: Types.ObjectId) => {
  const result = await Post.find({ store: storeId }).populate("store", {
    storeName: 1,
    photoURL: 1,
  });
  return result;
};
//== get Post by brand Id
export const getPostByBrandIdService = async (brandId: Types.ObjectId) => {
  const result = await Post.find({ brand: brandId }).populate("brand", {
    brandName: 1,
    photoURL: 1,
  });
  return result;
};
//== get Post by brand Id
export const getPostByCampaignIdService = async (
  campaignId: Types.ObjectId
) => {
  const result = await Post.find({ campaign: campaignId });
  return result;
};
//== get Post by brand Id
export const getPostByCategoryIdService = async (
  categoryId: Types.ObjectId
) => {
  const result = await Post.find({ category: categoryId });
  return result;
};
//== get Post by brand Id
export const getPostByNetworkIdService = async (networkId: Types.ObjectId) => {
  const result = await Post.find({ network: networkId });
  return result;
};
//== get Post by objectId
export const getPostByIdService = async (id: Types.ObjectId) => {
  const result = await Post.findOne(
    { _id: id },
    { postBy: 0, updateBy: 0 }
  ).populate("store", {
    storeName: 1,
    photoURL: 1,
  });
  return result;
};

//== create new Post
export const addNewPostService = async (post: object) => {
  const createdPost = await Post.create(post);
  const result = await createdPost.populate({
    path: "store",
    select: "storeName",
  });
  await setPostAsUnreadToUserService(createdPost._id);
  return result;
};

//== add post as unread to all verified users
export const setPostAsUnreadToUserService = async (postId: Types.ObjectId) => {
  const result = await User.updateMany(
    { isVerified: true },
    { $push: { newPosts: { moreAboutPost: postId } } }
  );
  return result;
};

//== update a Post
export const updateAPostService = async (
  PostId: Types.ObjectId,
  newData: any
) => {
  // add updator info
  let { updateBy, existPost, ...updateData } = newData;

  updateBy = { ...existPost.updateBy, ...updateBy };

  const result = await Post.updateOne(
    { _id: PostId },
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, upsert: true }
  );

  return result;
};

//== update a Post
export const revealedAPostService = async (PostId: Types.ObjectId) => {
  const result = await Post.updateOne(
    { _id: PostId },
    { $inc: { revealed: 1 } }
  );

  return result;
};

export const getAllPosts = async (query: any, isActivePostOnly: boolean) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("post", query, ...post_query_fields) as any;

  // set expiredate to show only active post
  const validityCheck = {
    expireDate: { $gt: new Date() },
  };
  // client side only
  isActivePostOnly && filters.$and.push(validityCheck);

  const result = await Post.aggregate([
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "storePopulated",
      },
    },
    {
      $addFields: {
        store: { $arrayElemAt: ["$storePopulated", 0] },
      },
    },
    {
      $project: {
        "store._id": 1,
        "store.storeName": 1,
        "store.storePhotoURL": 1,
        postTitle: 1,
        postType: 1,
        externalLink: 1,
        expireDate: 1,
        countries: 1,
        isVerified: 1,
        revealed: 1,
        postDescription: 1,
        couponCode: 1,
        createdAt: 1,
      },
    },
    {
      $match: filters,
    },
    {
      $sort: { [sortBy]: sortOrder },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  const totalDocuments = await Post.aggregate([
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "storePopulated",
      },
    },
    {
      $addFields: {
        store: { $arrayElemAt: ["$storePopulated", 0] },
      },
    },
    {
      $project: {
        "store._id": 1,
        "store.storeName": 1,
        "store.photoURL": 1,
        postTitle: 1,
        postType: 1,
        expireDate: 1,
        countries: 1,
        isVerified: 1,
        revealed: 1,
        couponCode: 1,
        createdAt: 1,
      },
    },
    {
      $match: filters,
    },
    {
      $count: "totalDocuments",
    },
  ]);
  return {
    meta: {
      page,
      limit,
      totalDocuments: totalDocuments.length
        ? totalDocuments[0].totalDocuments
        : 0,
    },
    data: result,
  };
};

//== delete a Post
export const deleteAPostService = async (PostId: Types.ObjectId) => {
  const result = await Post.deleteOne({ _id: PostId });

  return result;
};
//== delete a Post
export const deleteManyPostService = async (PostId: Types.ObjectId[]) => {
  const result = await Post.deleteMany({ _id: PostId });

  return result;
};
