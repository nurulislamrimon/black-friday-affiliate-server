import mongoose, { Types } from "mongoose";
import Network from "./network.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { network_query_fields } from "../../utils/constants";
import INetwork from "./network.interface";
import Post from "../post.module/post.model";

//== get Network by name
export const getNetworkByNetworkNameService = async (networkName: string) => {
  const result = await Network.findOne(
    { networkName: networkName },
    "-postBy -updateBy"
  );
  return result;
};

//== get Network by objectId
export const getNetworkByIdService = async (id: Types.ObjectId) => {
  const result = await Network.findOne({ _id: id }, "-postBy -updateBy");
  return result;
};

//== create new Network
export const addNewNetworkService = async (network: object) => {
  const result = await Network.create(network);
  return result;
};

//== update a network
export const updateANetworkService = async (
  networkId: Types.ObjectId,
  newData: any,
  session: mongoose.mongo.ClientSession
) => {
  // add updater info
  let { updateBy, existNetwork, ...updateData } = newData;

  updateBy = { ...existNetwork.updateBy, ...updateBy };

  const result = await Network.findByIdAndUpdate(
    networkId,
    { $set: updateData, $push: { updateBy: updateBy } },
    { runValidators: true, new: true, upsert: true, session }
  );

  return result;
};

// update posts thats are reffered to the network
export const updateRefferencePosts = async (
  networkId: Types.ObjectId,
  payload: INetwork | null,
  session: mongoose.mongo.ClientSession
) => {
  const result = await Post.updateMany(
    { "network.moreAboutNetwork": networkId },
    {
      $set: {
        "network.networkName": payload?.networkName,
      },
    },
    { session }
  );

  return result;
};

// get all Networks
export const getAllNetworks = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("Network", query, ...network_query_fields) as any;

  const result = await Network.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "network.moreAboutNetwork",
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

  const totalDocuments = await Network.aggregate([
    {
      $lookup: {
        from: "posts",
        foreignField: "network.moreAboutNetwork",
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

//== delete a Network
export const deleteANetworkService = async (NetworkId: Types.ObjectId) => {
  const result = await Network.deleteOne({ _id: NetworkId });

  return result;
};
