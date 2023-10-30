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
exports.deleteAStoreService = exports.getAllActiveStores = exports.getAllStores = exports.updateAStoreService = exports.addNewStoreService = exports.getStoreByIdService = exports.getStoreByStoreNameService = void 0;
const store_model_1 = __importDefault(require("./store.model"));
const search_filter_and_queries_1 = require("../../utils/search_filter_and_queries");
const constants_1 = require("../../utils/constants");
//== get Store by name
const getStoreByStoreNameService = (storeName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield store_model_1.default.findOne({ storeName: storeName });
    return result;
});
exports.getStoreByStoreNameService = getStoreByStoreNameService;
//== get Store by objectId
const getStoreByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield store_model_1.default.findOne({ _id: id }, { postBy: 0, updateBy: 0 });
    return result;
});
exports.getStoreByIdService = getStoreByIdService;
//== create new Store
const addNewStoreService = (store) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield store_model_1.default.create(store);
    return result;
});
exports.addNewStoreService = addNewStoreService;
//== update a Store
const updateAStoreService = (storeId, newData) => __awaiter(void 0, void 0, void 0, function* () {
    // add updator info
    let { updateBy, existStore } = newData, updateData = __rest(newData, ["updateBy", "existStore"]);
    updateBy = Object.assign(Object.assign({}, existStore.updateBy), updateBy);
    const result = yield store_model_1.default.updateOne({ _id: storeId }, { $set: updateData, $push: { updateBy: updateBy } }, { runValidators: true, upsert: true });
    return result;
});
exports.updateAStoreService = updateAStoreService;
// get all stores
const getAllStores = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { filters, skip, page, limit, sortBy, sortOrder } = (0, search_filter_and_queries_1.search_filter_and_queries)("store", query, ...constants_1.store_query_fields);
    const result = yield store_model_1.default.aggregate([
        {
            $lookup: {
                from: "posts",
                foreignField: "store",
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
    const totalDocuments = yield store_model_1.default.aggregate([
        {
            $lookup: {
                from: "posts",
                foreignField: "store",
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
exports.getAllStores = getAllStores;
// get all active stores
const getAllActiveStores = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { filters, skip, page, limit, sortBy, sortOrder } = (0, search_filter_and_queries_1.search_filter_and_queries)("store", query, ...constants_1.store_query_fields);
    const result = yield store_model_1.default.aggregate([
        {
            $lookup: {
                from: "posts",
                foreignField: "store",
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
    const totalDocuments = yield store_model_1.default.aggregate([
        {
            $lookup: {
                from: "posts",
                foreignField: "store",
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
                ? (_b = totalDocuments[0]) === null || _b === void 0 ? void 0 : _b.totalDocs
                : 0,
        },
        data: result,
    };
});
exports.getAllActiveStores = getAllActiveStores;
//== delete a Store
const deleteAStoreService = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield store_model_1.default.deleteOne({ _id: storeId });
    return result;
});
exports.deleteAStoreService = deleteAStoreService;
