import mongoose, { Types } from "mongoose";
import Store from "./store.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { store_query_fields } from "../../utils/constants";
import Post from "../post.module/post.model";
import IStore from "./store.interface";

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
  // add updater info
  let { updateBy, existStore, ...updateData } = newData;

  updateBy = { ...existStore.updateBy, ...updateBy };

  const result = await Store.findByIdAndUpdate(
    storeId,
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, new: true, upsert: true, session }
  );

  return result;
};

// update posts thats are reffered to the store
export const updateRefferencePosts = async (
  storeId: Types.ObjectId,
  payload: IStore | null,
  session: mongoose.mongo.ClientSession
) => {
  const result = await Post.updateMany(
    { "store.moreAboutStore": storeId },
    {
      $set: {
        "store.storeName": payload?.storeName,
        "store.storePhotoURL": payload?.storePhotoURL,
      },
    },
    { session }
  );

  return result;
};

// get all stores
export const getAllStores = async (query: any, isAdmin: boolean) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("store", query, ...store_query_fields) as any;

  const result = await Store.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "store.moreAboutStore",
        localField: "_id",
        as: "existPosts",
      },
    },
    {
      $addFields: { totalPosts: { $size: "$existPosts" } },
    },
    {
      $unwind: { path: "$existPosts", preserveNullAndEmptyArrays: isAdmin },
    },
    {
      $group: {
        _id: "$_id",
        countries: { $addToSet: "$existPosts.countries" },
        totalPosts: { $first: "$totalPosts" },
        storeName: { $first: "$storeName" },
        storeLink: { $first: "$storeLink" },
        storePhotoURL: { $first: "$storePhotoURL" },
        storeDescription: { $first: "$storeDescription" },
      },
    },
    {
      $project: {
        storeName: 1,
        storeLink: 1,
        storePhotoURL: 1,
        storeDescription: 1,
        totalPosts: 1,
        countries: {
          $reduce: {
            input: "$countries",
            initialValue: [],
            in: { $setUnion: ["$$this", "$$value"] },
          },
        },
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
        foreignField: "store.moreAboutStore",
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

//== delete a Store
export const deleteAStoreService = async (storeId: Types.ObjectId) => {
  const result = await Store.deleteOne({ _id: storeId });
  return result;
};
