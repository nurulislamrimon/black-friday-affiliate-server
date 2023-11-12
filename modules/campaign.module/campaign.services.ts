import mongoose, { Types } from "mongoose";
import Campaign from "./campaign.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { campaign_query_fields } from "../../utils/constants";
import ICampaign from "./campaign.interface";
import Post from "../post.module/post.model";

//== get Campaign by name
export const getCampaignByCampaignNameService = async (
  campaignName: string
) => {
  const result = await Campaign.findOne(
    { campaignName: campaignName },
    "-postBy -updateBy"
  );
  return result;
};
//== get Campaign by objectId
export const getCampaignByIdService = async (id: Types.ObjectId) => {
  const result = await Campaign.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: "posts",
        foreignField: "campaign.moreAboutCampaign",
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
        campaignName: { $first: "$campaignName" },
        campaignPhotoURL: { $first: "$campaignPhotoURL" },
        campaignDescription: { $first: "$campaignDescription" },
      },
    },
    {
      $project: {
        campaignName: 1,
        campaignPhotoURL: 1,
        campaignDescription: 1,
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
  ]);
  return Object.keys(result).length ? result[0] : result;
};

//== create new Campaign
export const addNewCampaignService = async (campaign: object) => {
  const result = await Campaign.create(campaign);
  return result;
};

//== update a campaign
export const updateACampaignService = async (
  campaignId: Types.ObjectId,
  newData: any,
  session: mongoose.mongo.ClientSession
) => {
  // add updater info
  let { updateBy, existCampaign, ...updateData } = newData;

  updateBy = { ...existCampaign.updateBy, ...updateBy };

  const result = await Campaign.findByIdAndUpdate(
    campaignId,
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, new: true, upsert: true, session }
  );

  return result;
};
// update posts thats are reffered to the campaign
export const updateRefferencePosts = async (
  campaignId: Types.ObjectId,
  payload: ICampaign | null,
  session: mongoose.mongo.ClientSession
) => {
  const result = await Post.updateMany(
    { "campaign.moreAboutCampaign": campaignId },
    {
      $set: {
        "campaign.campaignName": payload?.campaignName,
        "campaign.campaignPhotoURL": payload?.campaignPhotoURL,
      },
    },
    { session }
  );

  return result;
};

// get all campaigns
export const getAllCampaigns = async (query: any, isAdmin: boolean) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries(
      "campaign",
      query,
      ...campaign_query_fields
    ) as any;

  const result = await Campaign.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "campaign.moreAboutCampaign",
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
        campaignName: { $first: "$campaignName" },
        campaignLink: { $first: "$campaignLink" },
        campaignPhotoURL: { $first: "$campaignPhotoURL" },
        campaignDescription: { $first: "$campaignDescription" },
      },
    },
    {
      $project: {
        campaignName: 1,
        campaignLink: 1,
        campaignPhotoURL: 1,
        campaignDescription: 1,
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

  const totalDocuments = await Campaign.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "campaign.moreAboutCampaign",
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
        campaignName: { $first: "$campaignName" },
        campaignLink: { $first: "$campaignLink" },
        campaignPhotoURL: { $first: "$campaignPhotoURL" },
        campaignDescription: { $first: "$campaignDescription" },
      },
    },
    {
      $project: {
        campaignName: 1,
        campaignLink: 1,
        campaignPhotoURL: 1,
        campaignDescription: 1,
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

//== delete a Campaign
export const deleteACampaignService = async (campaignId: Types.ObjectId) => {
  const result = await Campaign.deleteOne({ _id: campaignId });

  return result;
};
