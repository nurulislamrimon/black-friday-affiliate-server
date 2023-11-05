import mongoose, { Types } from "mongoose";
import Brand from "./brand.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { brand_query_fields } from "../../utils/constants";
import IBrand from "./brand.interface";
import Post from "../post.module/post.model";

//== get Brand by name
export const getBrandByBrandNameService = async (brandName: string) => {
  const result = await Brand.findOne(
    { brandName: brandName },
    "-postBy -updateBy"
  );
  return result;
};
//== get Brand by objectId
export const getBrandByIdService = async (id: Types.ObjectId) => {
  const result = await Brand.findOne({ _id: id }, "-postBy -updateBy");
  return result;
};

//== create new Brand
export const addNewBrandService = async (brand: object) => {
  const result = await Brand.create(brand);
  return result;
};

// update a brand
export const updateABrandService = async (
  brandId: Types.ObjectId,
  newData: any,
  session: mongoose.mongo.ClientSession
) => {
  // add updater info
  let { updateBy, existBrand, ...updateData } = newData;

  updateBy = { ...existBrand.updateBy, ...updateBy };

  const result = await Brand.findByIdAndUpdate(
    brandId,
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, new: true, upsert: true, session }
  );

  return result;
};
// update those posts that reffers to the brand
export const updateRefferencePosts = async (
  brandId: Types.ObjectId,
  payload: IBrand | null,
  session: mongoose.mongo.ClientSession
) => {
  const result = await Post.updateMany(
    { "brand.moreAboutBrand": brandId },
    {
      $set: {
        "brand.brandName": payload?.brandName,
        "brand.brandPhotoURL": payload?.brandPhotoURL,
      },
    },
    { session }
  );

  return result;
};
// get all Brands
export const getAllBrands = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("Brand", query, ...brand_query_fields) as any;

  const result = await Brand.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "Brand",
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

  const totalDocuments = await Brand.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "Brand",
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

// get all active Brands
export const getAllActiveBrands = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("Brand", query, ...brand_query_fields) as any;

  const result = await Brand.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "brand",
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

  const totalDocuments = await Brand.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "brand",
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

//== delete a Brand
export const deleteABrandService = async (BrandId: Types.ObjectId) => {
  const result = await Brand.deleteOne({ _id: BrandId });

  return result;
};
