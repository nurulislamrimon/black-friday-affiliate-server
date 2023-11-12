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
exports.deleteACategoryService = exports.getAllCategories = exports.updateRefferencePosts = exports.updateACategoryService = exports.addNewCategoryService = exports.getCategoryByIdService = exports.getCategoryByCategoryNameService = void 0;
const category_model_1 = __importDefault(require("./category.model"));
const search_filter_and_queries_1 = require("../../utils/search_filter_and_queries");
const constants_1 = require("../../utils/constants");
const post_model_1 = __importDefault(require("../post.module/post.model"));
//== get Category by name
const getCategoryByCategoryNameService = (categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.findOne({ categoryName: categoryName }, "-postBy -updateBy");
    return result;
});
exports.getCategoryByCategoryNameService = getCategoryByCategoryNameService;
//== get Category by objectId
const getCategoryByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.aggregate([
        {
            $match: { _id: id },
        },
        {
            $lookup: {
                from: "posts",
                foreignField: "category.moreAboutCategory",
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
                categoryName: { $first: "$categoryName" },
                categoryLink: { $first: "$categoryLink" },
                categoryPhotoURL: { $first: "$categoryPhotoURL" },
                categoryDescription: { $first: "$categoryDescription" },
                howToUse: { $first: "$howToUse" },
            },
        },
        {
            $project: {
                categoryName: 1,
                categoryLink: 1,
                categoryPhotoURL: 1,
                categoryDescription: 1,
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
});
exports.getCategoryByIdService = getCategoryByIdService;
//== create new Category
const addNewCategoryService = (category) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.create(category);
    return result;
});
exports.addNewCategoryService = addNewCategoryService;
//== update a category
const updateACategoryService = (categoryId, newData, session) => __awaiter(void 0, void 0, void 0, function* () {
    // add updater info
    let { updateBy, existCategory } = newData, updateData = __rest(newData, ["updateBy", "existCategory"]);
    updateBy = Object.assign(Object.assign({}, existCategory.updateBy), updateBy);
    const result = yield category_model_1.default.findByIdAndUpdate(categoryId, { $set: updateData, $push: { updateBy: updateBy } }, { runValidators: true, new: true, upsert: true, session });
    return result;
});
exports.updateACategoryService = updateACategoryService;
// update posts thats are reffered to the category
const updateRefferencePosts = (categoryId, payload, session) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.updateMany({ "category.moreAboutCategory": categoryId }, {
        $set: {
            "category.categoryName": payload === null || payload === void 0 ? void 0 : payload.categoryName,
        },
    }, { session });
    return result;
});
exports.updateRefferencePosts = updateRefferencePosts;
// get all Categories
const getAllCategories = (query, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { filters, skip, page, limit, sortBy, sortOrder } = (0, search_filter_and_queries_1.search_filter_and_queries)("category", query, ...constants_1.category_query_fields);
    const result = yield category_model_1.default.aggregate([
        {
            $lookup: {
                from: "posts",
                foreignField: "category.moreAboutCategory",
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
                categoryName: { $first: "$categoryName" },
                totalPosts: { $first: "$totalPosts" },
                countries: { $addToSet: "$existPosts.countries" },
            },
        },
        {
            $project: {
                categoryName: 1,
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
    const totalDocuments = yield category_model_1.default.aggregate([
        {
            $lookup: {
                from: "posts",
                foreignField: "category.moreAboutCategory",
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
                categoryName: { $first: "$categoryName" },
                totalPosts: { $first: "$totalPosts" },
                countries: { $addToSet: "$existPosts.countries" },
            },
        },
        {
            $project: {
                categoryName: 1,
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
exports.getAllCategories = getAllCategories;
//== delete a Category
const deleteACategoryService = (CategoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.deleteOne({ _id: CategoryId });
    return result;
});
exports.deleteACategoryService = deleteACategoryService;
