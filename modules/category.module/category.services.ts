import { Types } from "mongoose";
import Category from "./category.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { category_query_fields } from "../../utils/constants";

//== get Category by name
export const getCategoryByCategoryNameService = async (
  categoryName: string
) => {
  const result = await Category.findOne({ categoryName: categoryName });
  return result;
};

//== get Category by objectId
export const getCategoryByIdService = async (id: Types.ObjectId) => {
  const result = await Category.findOne(
    { _id: id },
    { postBy: 0, updateBy: 0 }
  );
  return result;
};

//== create new Category
export const addNewCategoryService = async (category: object) => {
  const result = await Category.create(category);
  return result;
};

//== update a Category
export const updateACategoryService = async (
  CategoryId: Types.ObjectId,
  newData: any
) => {
  // add updator info
  let { updateBy, existCategory, ...updateData } = newData;

  updateBy = { ...existCategory.updateBy, ...updateBy };

  const result = await Category.updateOne(
    { _id: CategoryId },
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, upsert: true }
  );

  return result;
};

// get all Categorys
export const getAllCategorys = async (query: any) => {
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
        foreignField: "category",
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
        foreignField: "Category",
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
