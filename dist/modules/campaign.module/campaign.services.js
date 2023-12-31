"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteACampaignService = exports.getAllCampaigns = exports.updateRefferencePosts = exports.updateACampaignService = exports.addNewCampaignService = exports.getCampaignByIdService = exports.getCampaignByCampaignNameService = void 0;
const campaign_model_1 = __importDefault(require("./campaign.model"));
const search_filter_and_queries_1 = require("../../utils/search_filter_and_queries");
const constants_1 = require("../../utils/constants");
const post_model_1 = __importDefault(require("../post.module/post.model"));
//== get Campaign by name
const getCampaignByCampaignNameService = (campaignName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_model_1.default.findOne({ campaignName: campaignName }, "-postBy -updateBy");
    return result;
});
exports.getCampaignByCampaignNameService = getCampaignByCampaignNameService;
//== get Campaign by objectId
const getCampaignByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_model_1.default.aggregate([
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
                startPeriod: { $first: "$startPeriod" },
                endPeriod: { $first: "$endPeriod" },
            },
        },
        {
            $project: {
                campaignName: 1,
                campaignPhotoURL: 1,
                campaignDescription: 1,
                startPeriod: 1,
                endPeriod: 1,
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
});
exports.getCampaignByIdService = getCampaignByIdService;
//== create new Campaign
const addNewCampaignService = (campaign) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_model_1.default.create(campaign);
    return result;
});
exports.addNewCampaignService = addNewCampaignService;
//== update a campaign
const updateACampaignService = (campaignId, newData, session) => __awaiter(void 0, void 0, void 0, function* () {
    // add updater info
    let { updateBy, existCampaign } = newData, updateData = __rest(newData, ["updateBy", "existCampaign"]);
    updateBy = Object.assign(Object.assign({}, existCampaign.updateBy), updateBy);
    const result = yield campaign_model_1.default.findByIdAndUpdate(campaignId, { $set: updateData, $push: { updateBy: updateBy } }, { runValidators: true, new: true, upsert: true, session });
    return result;
});
exports.updateACampaignService = updateACampaignService;
// update posts thats are reffered to the campaign
const updateRefferencePosts = (campaignId, payload, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.updateMany({ "campaign.moreAboutCampaign": campaignId }, {
        $set: {
            "campaign.campaignName": payload === null || payload === void 0 ? void 0 : payload.campaignName,
            "campaign.campaignPhotoURL": payload === null || payload === void 0 ? void 0 : payload.campaignPhotoURL,
        },
    }, { session });
    return result;
});
exports.updateRefferencePosts = updateRefferencePosts;
// get all campaigns
const getAllCampaigns = (query, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { filters, skip, page, limit, sortBy, sortOrder } = (0, search_filter_and_queries_1.search_filter_and_queries)("campaign", query, ...constants_1.campaign_query_fields);
    const result = yield campaign_model_1.default.aggregate([
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
                campaignPhotoURL: { $first: "$campaignPhotoURL" },
            },
        },
        {
            $project: {
                campaignName: 1,
                campaignPhotoURL: 1,
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
    const totalDocuments = yield campaign_model_1.default.aggregate([
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
                ? (_a = totalDocuments[0]) === null || _a === void 0 ? void 0 : _a.totalDocs
                : 0,
        },
        data: result,
    };
});
exports.getAllCampaigns = getAllCampaigns;
//== delete a Campaign
const deleteACampaignService = (campaignId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield campaign_model_1.default.deleteOne({ _id: campaignId });
    return result;
});
exports.deleteACampaignService = deleteACampaignService;
