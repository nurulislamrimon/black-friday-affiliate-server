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
  const result = await Brand.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: "posts",
        foreignField: "brand.moreAboutBrand",
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
        brandName: { $first: "$brandName" },
        brandLink: { $first: "$brandLink" },
        brandPhotoURL: { $first: "$brandPhotoURL" },
        brandDescription: { $first: "$brandDescription" },
        howToUse: { $first: "$howToUse" },
      },
    },
    {
      $project: {
        brandName: 1,
        brandLink: 1,
        brandPhotoURL: 1,
        brandDescription: 1,
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

// get all brands
export const getAllBrands = async (query: any, isAdmin: boolean) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("brand", query, ...brand_query_fields) as any;

  const result = await Brand.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "brand.moreAboutBrand",
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
        brandName: { $first: "$brandName" },
        brandLink: { $first: "$brandLink" },
        brandPhotoURL: { $first: "$brandPhotoURL" },
        brandDescription: { $first: "$brandDescription" },
      },
    },
    {
      $project: {
        brandName: 1,
        brandLink: 1,
        brandPhotoURL: 1,
        brandDescription: 1,
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

  const totalDocuments = await Brand.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "brand.moreAboutBrand",
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
        brandName: { $first: "$brandName" },
        brandLink: { $first: "$brandLink" },
        brandPhotoURL: { $first: "$brandPhotoURL" },
        brandDescription: { $first: "$brandDescription" },
      },
    },
    {
      $project: {
        brandName: 1,
        brandLink: 1,
        brandPhotoURL: 1,
        brandDescription: 1,
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

//== delete a Brand
export const deleteABrandService = async (BrandId: Types.ObjectId) => {
  const result = await Brand.deleteOne({ _id: BrandId });

  return result;
};
