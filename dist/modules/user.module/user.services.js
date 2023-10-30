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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNotificationReadedService = exports.getNotificationService = exports.getUnreadedNotificationCountService = exports.deleteAUserByEmailService = exports.addAndRemovePostFromFavouriteService = exports.addAndRemoveStoreFromFavouriteService = exports.getFavouritePostService = exports.getFavouriteStoreService = exports.addNewUserService = exports.getUserByIdService = exports.updateMeByEmailService = exports.getUserByEmailService = exports.getAllUserService = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const search_filter_and_queries_1 = require("../../utils/search_filter_and_queries");
const constants_1 = require("../../utils/constants");
//== get all users
const getAllUserService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { filters, skip, page, limit, sortBy, sortOrder } = (0, search_filter_and_queries_1.search_filter_and_queries)("user", query, ...constants_1.user_query_fields);
    // const result = await User.find(filters, {
    //   password: 0,
    //   newPosts: 0,
    //   favourite: 0,
    // })
    //   .sort({ [sortBy]: sortOrder })
    //   .skip(skip)
    //   .limit(limit);
    const result = yield user_model_1.default.aggregate([
        {
            $lookup: {
                from: "administrators",
                foreignField: "email",
                localField: "email",
                as: "isAdministrator",
            },
        },
        {
            $match: {
                isAdministrator: { $size: 0 },
            },
        },
        {
            $project: {
                password: 0,
                newPosts: 0,
                favourite: 0,
                isAdministrator: 0,
            },
        },
        { $match: filters },
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
    const totalDocuments = yield user_model_1.default.aggregate([
        {
            $lookup: {
                from: "administrators",
                foreignField: "email",
                localField: "email",
                as: "isAdministrator",
            },
        },
        {
            $match: {
                isAdministrator: { $size: 0 },
            },
        },
        {
            $project: {
                password: 0,
                newPosts: 0,
                favourite: 0,
                isAdministrator: 0,
            },
        },
        { $match: filters },
        {
            $count: "totalDocs",
        },
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
exports.getAllUserService = getAllUserService;
//== get user by email address without password
const getUserByEmailService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findOne({ email: email }, { password: 0, newPosts: 0, favourite: 0 });
    return result;
});
exports.getUserByEmailService = getUserByEmailService;
//== get user by email address without password
const updateMeByEmailService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.updateOne({ _id: id }, { $set: payload }, { runValidators: true });
    return result;
});
exports.updateMeByEmailService = updateMeByEmailService;
//== get user by id
const getUserByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findOne({ _id: id }, { password: 0 });
    return result;
});
exports.getUserByIdService = getUserByIdService;
//== create new user
const addNewUserService = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.create(user).then((data) => {
        // data.password = undefined;
        return data;
    });
    return result;
});
exports.addNewUserService = addNewUserService;
//== add store to the favourite list
const getFavouriteStoreService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findOne({ email: email }, { "favourite.stores": 1, email: 1, name: 1 }).populate({
        path: "favourite.stores",
        options: {
            projection: {
                postBy: 0,
                updateBy: 0,
                howToUse: 0,
            },
        },
    });
    return result;
});
exports.getFavouriteStoreService = getFavouriteStoreService;
//== add post to the favourite list
const getFavouritePostService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findOne({ email: email }, { "favourite.posts": 1, email: 1, name: 1 }).populate({
        path: "favourite.posts",
        options: {
            projection: {
                postBy: 0,
                updateBy: 0,
            },
        },
    });
    return result;
});
exports.getFavouritePostService = getFavouritePostService;
//== add store to the favourite list
const addAndRemoveStoreFromFavouriteService = (email, id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: email });
    if (!user) {
        return null;
    }
    let updateQuery = {};
    if (user.favourite.stores.includes(id)) {
        updateQuery = { $pull: { "favourite.stores": id } };
    }
    else {
        updateQuery = { $addToSet: { "favourite.stores": id } };
    }
    const result = yield user_model_1.default.updateOne({ email: email }, updateQuery);
    return result;
});
exports.addAndRemoveStoreFromFavouriteService = addAndRemoveStoreFromFavouriteService;
//== add post to the favourite list
const addAndRemovePostFromFavouriteService = (email, id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: email });
    if (!user) {
        return null;
    }
    let updateQuery = {};
    if (user.favourite.posts.includes(id)) {
        updateQuery = { $pull: { "favourite.posts": id } };
    }
    else {
        updateQuery = { $addToSet: { "favourite.posts": id } };
    }
    const result = yield user_model_1.default.updateOne({ email: email }, updateQuery);
    return result;
});
exports.addAndRemovePostFromFavouriteService = addAndRemovePostFromFavouriteService;
//== delete user
const deleteAUserByEmailService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.deleteOne({ email: email });
    return result;
});
exports.deleteAUserByEmailService = deleteAUserByEmailService;
//== compare password by email and password
// export const comparePassword = async (email: string, password: string) => {
//   const user = await User.findOne({ email: email }, { password: 1 });
//   const isPasswordMatched = await bcrypt.compare(
//     password,
//     user?.password || ""
//   );
//   return isPasswordMatched;
// };
//== verify a user
// export const verifyAUserService = async (id: Types.ObjectId) => {
//   const result = await User.updateOne(
//     { _id: id },
//     {
//       $set: {
//         isVerified: true,
//       },
//     }
//   );
//   return result;
// };
// =====notification also====
// calculate unreaded post
const getUnreadedNotificationCountService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.aggregate([
        {
            $match: { email: email },
        },
        {
            $unwind: "$newPosts",
        },
        {
            $match: { "newPosts.status": "unreaded" },
        },
        {
            $count: "newPosts",
        },
    ]);
    return result ? result[0] : result;
});
exports.getUnreadedNotificationCountService = getUnreadedNotificationCountService;
//== get notification based on user
const getNotificationService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.findOne({ email: email }, { newPosts: 1, email: 1, name: 1 }).populate({
        path: "newPosts.moreAboutPost",
        select: "-postBy -updateBy",
        populate: { path: "store", select: "storeName photoURL" },
    });
    // .select("postBy");
    return result;
});
exports.getNotificationService = getNotificationService;
//== set notification based on user
const setNotificationReadedService = (email, postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.updateOne({
        email: email,
        "newPosts.moreAboutPost": postId,
    }, {
        $set: {
            "newPosts.$.status": "readed",
        },
    }).populate("newPosts.moreAboutPost");
    return result;
});
exports.setNotificationReadedService = setNotificationReadedService;
