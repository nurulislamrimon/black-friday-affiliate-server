import { Types } from "mongoose";
import Administrators from "./administrators.model";
import { search_filter_and_queries } from "../../utils/search_filter_and_queries";
import { user_query_fields } from "../../utils/constants";

//== create new Administrators
export const addNewAdministratorsService = async (payload: object) => {
  const result = await Administrators.create(payload);
  return result;
};

// get all admin and manager
export const getAllAdminAndManagerService = async (query: any) => {
  const { filters, skip, page, limit, sortBy, sortOrder } =
    search_filter_and_queries("user", query, ...user_query_fields) as any;

  const result = await Administrators.aggregate([
    {
      $lookup: {
        from: "users",
        foreignField: "email",
        localField: "email",
        as: "userInfo",
      },
    },
    {
      $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: 1,
        email: 1,
        role: 1,
        name: "$userInfo.name",
        country: "$userInfo.country",
        isVerified: "$userInfo.isVerified",
        photoURL: "$userInfo.photoURL",
        createdAt: 1,
      },
    },
    {
      $match: filters,
    },
    {
      $sort: {
        [sortBy]: sortOrder,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);
  const totalDocuments = await Administrators.countDocuments(filters);
  return {
    meta: {
      page,
      limit,
      totalDocuments,
    },
    data: result,
  };
};
// get me admin and manager
export const getMeAdminAndManagerService = async (email: string) => {
  const result = await Administrators.aggregate([
    {
      $match: {
        email: email,
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "email",
        localField: "email",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $project: {
        _id: 1,
        email: 1,
        role: 1,
        name: "$userInfo.name",
        country: "$userInfo.country",
        isVerified: "$userInfo.isVerified",
        photoURL: "$userInfo.photoURL",
        createdAt: 1,
      },
    },
  ]);
  return result ? result[0] : result;
};

//== get Administrators by email address used in authorization
export const getAdministratorsByEmailService = async (email: string) => {
  const result = await Administrators.findOne({ email: email });
  return result;
};
//== get Administrators by id
export const getAdministratorsByIdService = async (id: Types.ObjectId) => {
  const result = await Administrators.findOne({ _id: id });
  return result;
};

//== update an administrator
export const updateAdministratorService = async (
  targetedAdministratorId: Types.ObjectId,
  role: string
) => {
  const result = await Administrators.updateOne(
    { _id: targetedAdministratorId },
    { $set: { role: role } },
    { runValidators: true }
  );
  return result;
};
//== delete an administrator
export const deleteAdministratorService = async (
  targetedAdministratorId: Types.ObjectId
) => {
  const result = await Administrators.findOneAndDelete({
    _id: targetedAdministratorId,
  });
  return result;
};
