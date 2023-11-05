import mongoose, { Types } from "mongoose";
import Store from "./store.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { store_query_fields } from "../../utils/constants";
import Post from "../post.module/post.model";

//== create new Store
export const addNewStoreService = async (store: object) => {
  const result = await Store.create(store);
  return result;
};

//== get Store by name
export const getStoreByStoreNameService = async (storeName: string) => {
  const result = await Store.findOne(
    { storeName: storeName },
    "-postBy -updateBy"
  );
  return result;
};
//== get Store by objectId
export const getStoreByIdService = async (id: Types.ObjectId) => {
  const result = await Store.findOne({ _id: id }, "-postBy -updateBy");
  return result;
};

//== update a Store
export const updateAStoreService = async (
  storeId: Types.ObjectId,
  newData: any,
  session: mongoose.mongo.ClientSession
) => {
  // add updator info
  let { updateBy, existStore, ...updateData } = newData;

  updateBy = { ...existStore.updateBy, ...updateBy };

  const result = await Store.updateOne(
    { _id: storeId },
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, upsert: true, session }
  );

  return result;
};

export const updateRefferencePosts = async (
  storeId: Types.ObjectId,
  session: mongoose.mongo.ClientSession
) => {
  const store = await getStoreByIdService(storeId);
  if (!store) {
    throw new Error("Store not found!");
  }
  const result = await Post.updateMany(
    { "store.moreAboutStore": storeId },
    {
      $set: {
        "store.storeName": store.storeName,
        "store.storePhotoURL": store.storePhotoURL,
      },
    },
    { session }
  );

  return result;
};

// get all stores
export const getAllStores = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("store", query, ...store_query_fields) as any;

  const result = await Store.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "store",
        localField: "_id",
        as: "existPosts",
      },
    },
    {
      $addFields: { totalPosts: { $size: "$existPosts" } },
    },
    {
      $project: {
        existPosts: 0,
        postBy: 0,
        updateBy: 0,
        howToUse: 0,
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

  const totalDocuments = await Store.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "store",
        localField: "_id",
        as: "existPosts",
      },
    },
    {
      $match: filters,
    },
    { $count: "totalDocs" },
  ]);
  return {
    meta: {
      page,
      limit,
      totalDocuments: Object.keys(totalDocuments).length
        ? totalDocuments[0]?.totalDocs
        : 0,
    },
    data: result,
  };
};

// get all active stores
export const getAllActiveStores = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("store", query, ...store_query_fields) as any;

  const result = await Store.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "store",
        localField: "_id",
        as: "existPosts",
      },
    },
    {
      $match: {
        existPosts: { $ne: [] },
      },
    },
    {
      $addFields: { totalPosts: { $size: "$existPosts" } },
    },
    {
      $project: {
        existPosts: 0,
        postBy: 0,
        updateBy: 0,
        howToUse: 0,
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

  const totalDocuments = await Store.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "store",
        localField: "_id",
        as: "existPosts",
      },
    },
    {
      $match: {
        existPosts: { $ne: [] },
      },
    },
    {
      $match: filters,
    },
    { $count: "totalDocs" },
  ]);
  return {
    meta: {
      page,
      limit,
      totalDocuments: Object.keys(totalDocuments).length
        ? totalDocuments[0]?.totalDocs
        : 0,
    },
    data: result,
  };
};

//== delete a Store
export const deleteAStoreService = async (storeId: Types.ObjectId) => {
  const result = await Store.deleteOne({ _id: storeId });

  return result;
};
