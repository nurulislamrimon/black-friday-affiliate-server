"use strict";
// export const getAllPosts = async (query: any, isActivePostOnly: boolean) => {
//   const { filters, skip, page, limit, sortBy, sortOrder } =
//     search_filter_and_queries("post", query, ...post_query_fields) as any;
//   // set expiredate to show only active post
//   const validityCheck = {
//     expireDate: { $gt: new Date() },
//   };
//   // client side only
//   isActivePostOnly && filters.$and.push(validityCheck);
//   const result = await Post.aggregate([
//     {
//       $lookup: {
//         from: "stores",
//         localField: "store",
//         foreignField: "_id",
//         as: "storePopulated",
//       },
//     },
//     {
//       $lookup: {
//         from: "brands",
//         localField: "brand",
//         foreignField: "_id",
//         as: "brandPopulated",
//       },
//     },
//     {
//       $lookup: {
//         from: "categories",
//         localField: "category",
//         foreignField: "_id",
//         as: "categoryPopulated",
//       },
//     },
//     {
//       $lookup: {
//         from: "campaigns",
//         localField: "campaign",
//         foreignField: "_id",
//         as: "campaignPopulated",
//       },
//     },
//     {
//       $addFields: {
//         store: { $arrayElemAt: ["$storePopulated", 0] },
//         brand: { $arrayElemAt: ["$brandPopulated", 0] },
//         category: { $arrayElemAt: ["$categoryPopulated", 0] },
//         campaign: { $arrayElemAt: ["$campaignPopulated", 0] },
//       },
//     },
//     {
//       $project: {
//         "store.storeName": 1,
//         "store.storePhotoURL": 1,
//         "brand.brandName": 1,
//         "brand.brandPhotoURL": 1,
//         "category.categoryName": 1,
//         "campaign.campaignName": 1,
//         "campaign.campaignPhotoURL": 1,
//         postTitle: 1,
//         postPhotoURL: 1,
//         productPreviewLink: 1,
//         postType: 1,
//         dealLink: 1,
//         discountPercentage: 1,
//         expireDate: 1,
//         countries: 1,
//         isVerified: 1,
//         revealed: 1,
//         postDescription: 1,
//         couponCode: 1,
//         createdAt: 1,
//       },
//     },
//     {
//       $match: filters,
//     },
//     {
//       $sort: { [sortBy]: sortOrder },
//     },
//     {
//       $skip: skip,
//     },
//     {
//       $limit: limit,
//     },
//   ]);
//   const totalDocuments = await Post.aggregate([
//     {
//       $lookup: {
//         from: "stores",
//         localField: "store",
//         foreignField: "_id",
//         as: "storePopulated",
//       },
//     },
//     {
//       $lookup: {
//         from: "brands",
//         localField: "brand",
//         foreignField: "_id",
//         as: "brandPopulated",
//       },
//     },
//     {
//       $lookup: {
//         from: "categories",
//         localField: "category",
//         foreignField: "_id",
//         as: "categoryPopulated",
//       },
//     },
//     {
//       $lookup: {
//         from: "campaigns",
//         localField: "campaign",
//         foreignField: "_id",
//         as: "campaignPopulated",
//       },
//     },
//     {
//       $addFields: {
//         store: { $arrayElemAt: ["$storePopulated", 0] },
//         brand: { $arrayElemAt: ["$brandPopulated", 0] },
//         category: { $arrayElemAt: ["$categoryPopulated", 0] },
//         campaign: { $arrayElemAt: ["$campaignPopulated", 0] },
//       },
//     },
//     {
//       $project: {
//         "store.storeName": 1,
//         "store.storePhotoURL": 1,
//         "brand.brandName": 1,
//         "brand.brandPhotoURL": 1,
//         "category.categoryName": 1,
//         "campaign.campaignName": 1,
//         "campaign.campaignPhotoURL": 1,
//         postTitle: 1,
//         postType: 1,
//         expireDate: 1,
//         countries: 1,
//         isVerified: 1,
//         revealed: 1,
//         couponCode: 1,
//         createdAt: 1,
//       },
//     },
//     {
//       $match: filters,
//     },
//     {
//       $count: "totalDocuments",
//     },
//   ]);
//   return {
//     meta: {
//       page,
//       limit,
//       totalDocuments: totalDocuments.length
//         ? totalDocuments[0].totalDocuments
//         : 0,
//     },
//     // data: filters,
//     data: result,
//   };
// };
// const totalDocuments = await Post.aggregate([
//     {
//       $lookup: {
//         from: "stores",
//         localField: "store",
//         foreignField: "_id",
//         as: "storePopulated",
//       },
//     },
//     {
//       $lookup: {
//         from: "brands",
//         localField: "brand",
//         foreignField: "_id",
//         as: "brandPopulated",
//       },
//     },
//     {
//       $lookup: {
//         from: "categories",
//         localField: "category",
//         foreignField: "_id",
//         as: "categoryPopulated",
//       },
//     },
//     {
//       $lookup: {
//         from: "campaigns",
//         localField: "campaign",
//         foreignField: "_id",
//         as: "campaignPopulated",
//       },
//     },
//     {
//       $addFields: {
//         store: { $arrayElemAt: ["$storePopulated", 0] },
//         brand: { $arrayElemAt: ["$brandPopulated", 0] },
//         category: { $arrayElemAt: ["$categoryPopulated", 0] },
//         campaign: { $arrayElemAt: ["$campaignPopulated", 0] },
//       },
//     },
//     {
//       $project: {
//         "store.storeName": 1,
//         "store.storePhotoURL": 1,
//         "brand.brandName": 1,
//         "brand.brandPhotoURL": 1,
//         "category.categoryName": 1,
//         "campaign.campaignName": 1,
//         "campaign.campaignPhotoURL": 1,
//         postTitle: 1,
//         postType: 1,
//         expireDate: 1,
//         countries: 1,
//         isVerified: 1,
//         revealed: 1,
//         couponCode: 1,
//         createdAt: 1,
//       },
//     },
//     {
//       $match: filters,
//     },
//     {
//       $count: "totalDocuments",
//     },
//   ]);
//   return {
//     meta: {
//       page,
//       limit,
//       totalDocuments: totalDocuments.length
//         ? totalDocuments[0].totalDocuments
//         : 0,
//     },
//     // data: filters,
//     data: result,
//   };
