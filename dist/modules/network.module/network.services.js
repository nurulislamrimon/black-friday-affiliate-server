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
exports.deleteANetworkService = exports.getAllNetworks = exports.updateRefferencePosts = exports.updateANetworkService = exports.addNewNetworkService = exports.getNetworkByIdService = exports.getNetworkByNetworkNameService = void 0;
const network_model_1 = __importDefault(require("./network.model"));
const search_filter_and_queries_1 = require("../../utils/search_filter_and_queries");
const constants_1 = require("../../utils/constants");
const post_model_1 = __importDefault(require("../post.module/post.model"));
//== get Network by name
const getNetworkByNetworkNameService = (networkName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield network_model_1.default.findOne({ networkName: networkName }, "-postBy -updateBy");
    return result;
});
exports.getNetworkByNetworkNameService = getNetworkByNetworkNameService;
//== get Network by objectId
const getNetworkByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield network_model_1.default.findOne({ _id: id }, "-postBy -updateBy");
    return result;
});
exports.getNetworkByIdService = getNetworkByIdService;
//== create new Network
const addNewNetworkService = (network) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield network_model_1.default.create(network);
    return result;
});
exports.addNewNetworkService = addNewNetworkService;
//== update a network
const updateANetworkService = (networkId, newData, session) => __awaiter(void 0, void 0, void 0, function* () {
    // add updater info
    let { updateBy, existNetwork } = newData, updateData = __rest(newData, ["updateBy", "existNetwork"]);
    updateBy = Object.assign(Object.assign({}, existNetwork.updateBy), updateBy);
    const result = yield network_model_1.default.findByIdAndUpdate(networkId, { $set: updateData, $push: { updateBy: updateBy } }, { runValidators: true, new: true, upsert: true, session });
    return result;
});
exports.updateANetworkService = updateANetworkService;
// update posts thats are reffered to the network
const updateRefferencePosts = (networkId, payload, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.updateMany({ "network.moreAboutNetwork": networkId }, {
        $set: {
            "network.networkName": payload === null || payload === void 0 ? void 0 : payload.networkName,
        },
    }, { session });
    return result;
});
exports.updateRefferencePosts = updateRefferencePosts;
// get all Networks
const getAllNetworks = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { filters, skip, page, limit, sortBy, sortOrder } = (0, search_filter_and_queries_1.search_filter_and_queries)("Network", query, ...constants_1.network_query_fields);
    const result = yield network_model_1.default.aggregate([
        {
            $lookup: {
                from: "posts",
                foreignField: "network",
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
    const totalDocuments = yield network_model_1.default.aggregate([
        {
            $lookup: {
                from: "posts",
                foreignField: "network",
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
                ? (_a = totalDocuments[0]) === null || _a === void 0 ? void 0 : _a.totalDocs
                : 0,
        },
        data: result,
    };
});
exports.getAllNetworks = getAllNetworks;
//== delete a Network
const deleteANetworkService = (NetworkId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield network_model_1.default.deleteOne({ _id: NetworkId });
    return result;
});
exports.deleteANetworkService = deleteANetworkService;
