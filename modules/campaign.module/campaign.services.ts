import { Types } from "mongoose";
import Campaign from "./campaign.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { campaign_query_fields } from "../../utils/constants";

//== get Campaign by name
export const getCampaignByCampaignNameService = async (
  campaignName: string
) => {
  const result = await Campaign.findOne({ campaignName: campaignName });
  return result;
};
//== get Campaign by objectId
export const getCampaignByIdService = async (id: Types.ObjectId) => {
  const result = await Campaign.findOne(
    { _id: id },
    { postBy: 0, updateBy: 0 }
  );
  return result;
};

//== create new Campaign
export const addNewCampaignService = async (campaign: object) => {
  const result = await Campaign.create(campaign);
  return result;
};
//== update a Campaign
export const updateACampaignService = async (
  CampaignId: Types.ObjectId,
  newData: any
) => {
  // add updator info
  let { updateBy, existCampaign, ...updateData } = newData;

  updateBy = { ...existCampaign.updateBy, ...updateBy };

  const result = await Campaign.updateOne(
    { _id: CampaignId },
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, upsert: true }
  );

  return result;
};

// get all Campaigns
export const getAllCampaigns = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries(
      "Campaign",
      query,
      ...campaign_query_fields
    ) as any;

  const result = await Campaign.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "campaign",
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

  const totalDocuments = await Campaign.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "campaign",
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

// get all active Campaigns
export const getAllActiveCampaigns = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries(
      "Campaign",
      query,
      ...campaign_query_fields
    ) as any;

  const result = await Campaign.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "campaign",
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

  const totalDocuments = await Campaign.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "campaign",
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

//== delete a Campaign
export const deleteACampaignService = async (campaignId: Types.ObjectId) => {
  const result = await Campaign.deleteOne({ _id: campaignId });

  return result;
};
