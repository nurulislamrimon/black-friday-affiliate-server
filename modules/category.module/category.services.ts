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
  const result = await Category.findOne({ _id: id }, "-postBy -updateBy");
  return result;
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

// get all active Brands
export const getActiveCategories = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries(
      "Category",
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

// get all Categorys
export const getAllCategories = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries(
      "Category",
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
