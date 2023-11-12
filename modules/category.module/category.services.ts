import mongoose, { Types } from "mongoose";
import Category from "./category.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { category_query_fields } from "../../utils/constants";
import ICategory from "./category.interface";
import Post from "../post.module/post.model";

//== get Category by name
export const getCategoryByCategoryNameService = async (
  categoryName: string
) => {
  const result = await Category.findOne(
    { categoryName: categoryName },
    "-postBy -updateBy"
  );
  return result;
};

//== get Category by objectId
export const getCategoryByIdService = async (id: Types.ObjectId) => {
  const result = await Category.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: "posts",
        foreignField: "category.moreAboutCategory",
        localField: "_id",
        as: "existPosts",
      },
    },
    {
      $addFields: { totalPosts: { $size: "$existPosts" } },
    },
    {
      $unwind: { path: "$existPosts", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$_id",
        countries: { $addToSet: "$existPosts.countries" },
        totalPosts: { $first: "$totalPosts" },
        categoryName: { $first: "$categoryName" },
        categoryLink: { $first: "$categoryLink" },
        categoryPhotoURL: { $first: "$categoryPhotoURL" },
        categoryDescription: { $first: "$categoryDescription" },
        howToUse: { $first: "$howToUse" },
      },
    },
    {
      $project: {
        categoryName: 1,
        categoryLink: 1,
        categoryPhotoURL: 1,
        categoryDescription: 1,
        totalPosts: 1,
        howToUse: 1,
        countries: {
          $reduce: {
            input: "$countries",
            initialValue: [],
            in: { $setUnion: ["$$this", "$$value"] },
          },
        },
      },
    },
  ]);
  return Object.keys(result).length ? result[0] : result;
};

//== create new Category
export const addNewCategoryService = async (category: object) => {
  const result = await Category.create(category);
  return result;
};

//== update a category
export const updateACategoryService = async (
  categoryId: Types.ObjectId,
  newData: any,
  session: mongoose.mongo.ClientSession
) => {
  // add updater info
  let { updateBy, existCategory, ...updateData } = newData;

  updateBy = { ...existCategory.updateBy, ...updateBy };

  const result = await Category.findByIdAndUpdate(
    categoryId,
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, new: true, upsert: true, session }
  );

  return result;
};
// update posts thats are reffered to the category
export const updateRefferencePosts = async (
  categoryId: Types.ObjectId,
  payload: ICategory | null,
  session: mongoose.mongo.ClientSession
) => {
  const result = await Post.updateMany(
    { "category.moreAboutCategory": categoryId },
    {
      $set: {
        "category.categoryName": payload?.categoryName,
      },
    },
    { session }
  );

  return result;
};

// get all Categories
export const getAllCategories = async (query: any, isAdmin: boolean) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries(
      "category",
      query,
      ...category_query_fields
    ) as any;

  const result = await Category.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "category.moreAboutCategory",
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
        categoryName: { $first: "$categoryName" },
        totalPosts: { $first: "$totalPosts" },
        countries: { $addToSet: "$existPosts.countries" },
      },
    },
    {
      $project: {
        categoryName: 1,
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

  const totalDocuments = await Category.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "category.moreAboutCategory",
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
        categoryName: { $first: "$categoryName" },
        totalPosts: { $first: "$totalPosts" },
        countries: { $addToSet: "$existPosts.countries" },
      },
    },
    {
      $project: {
        categoryName: 1,
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

//== delete a Category
export const deleteACategoryService = async (CategoryId: Types.ObjectId) => {
  const result = await Category.deleteOne({ _id: CategoryId });

  return result;
};
