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
exports.getPostByNetworkIdService = exports.getPostByCategoryIdService = exports.getPostByCampaignIdService = exports.getPostByBrandIdService = exports.getPostByStoreIdService = exports.deleteManyPostService = exports.deleteAPostService = exports.getAllPosts = exports.revealedAPostService = exports.updateAPostService = exports.setPostAsUnreadToUserService = exports.addNewPostService = exports.getPostByIdService = exports.getPostByPostTitleService = exports.searchGloballyAdminService = exports.searchGloballyClientService = void 0;
const post_model_1 = __importDefault(require("./post.model"));
const user_model_1 = __importDefault(require("../user.module/user.model"));
const search_filter_and_queries_1 = require("../../utils/search_filter_and_queries");
const constants_1 = require("../../utils/constants");
const store_services_1 = require("../store.module/store.services");
//== get search client
const searchGloballyClientService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const stores = yield (0, store_services_1.getAllStores)(query, false);
    const posts = yield (0, exports.getAllPosts)(query, true);
    return { stores, posts };
});
exports.searchGloballyClientService = searchGloballyClientService;
//== get search admin
const searchGloballyAdminService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const stores = yield (0, store_services_1.getAllStores)(query, true);
    const posts = yield (0, exports.getAllPosts)(query, false);
    return { stores, posts };
});
exports.searchGloballyAdminService = searchGloballyAdminService;
//== get Post by name
const getPostByPostTitleService = (postTitle) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.findOne({ postTitle: postTitle });
    return result;
});
exports.getPostByPostTitleService = getPostByPostTitleService;
//== get Post by objectId
const getPostByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.findOne({ _id: id }, { postBy: 0, updateBy: 0 });
    return result;
});
exports.getPostByIdService = getPostByIdService;
//== create new Post
const addNewPostService = (post) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.create(post);
    yield (0, exports.setPostAsUnreadToUserService)(result._id);
    return result;
});
exports.addNewPostService = addNewPostService;
//== add post as unread to all verified users
const setPostAsUnreadToUserService = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.default.updateMany({ isVerified: true }, { $push: { newPosts: { moreAboutPost: postId } } });
    return result;
});
exports.setPostAsUnreadToUserService = setPostAsUnreadToUserService;
//== update a Post
const updateAPostService = (PostId, newData) => __awaiter(void 0, void 0, void 0, function* () {
    // add updator info
    let { updateBy, existPost } = newData, updateData = __rest(newData, ["updateBy", "existPost"]);
    updateBy = Object.assign(Object.assign({}, existPost.updateBy), updateBy);
    const result = yield post_model_1.default.findByIdAndUpdate(PostId, { $set: updateData, $push: { updateBy: updateBy } }, { runValidators: true, upsert: true, new: true });
    return result;
});
exports.updateAPostService = updateAPostService;
//== update a Post
const revealedAPostService = (PostId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.updateOne({ _id: PostId }, { $inc: { revealed: 1 } });
    return result;
});
exports.revealedAPostService = revealedAPostService;
const getAllPosts = (query, isActivePostOnly) => __awaiter(void 0, void 0, void 0, function* () {
    const { filters, skip, page, limit, sortBy, sortOrder } = (0, search_filter_and_queries_1.search_filter_and_queries)("post", query, ...constants_1.post_query_fields);
    // set expiredate to show only active post
    const validityCheck = {
        expireDate: { $gt: new Date() },
    };
    // client side only
    isActivePostOnly && filters.$and.push(validityCheck);
    const result = yield post_model_1.default.find(filters)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit);
    const totalDocuments = yield post_model_1.default.countDocuments(filters);
    return {
        meta: {
            page,
            limit,
            totalDocuments: totalDocuments,
        },
        data: result,
    };
});
exports.getAllPosts = getAllPosts;
//== delete a Post
const deleteAPostService = (PostId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.deleteOne({ _id: PostId });
    return result;
});
exports.deleteAPostService = deleteAPostService;
//== delete a Post
const deleteManyPostService = (PostId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.deleteMany({ _id: PostId });
    return result;
});
exports.deleteManyPostService = deleteManyPostService;
// ===========================based on special ids====================
//== get Post by store Id
const getPostByStoreIdService = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find({ store: storeId }).populate("store", {
        storeName: 1,
        storePhotoURL: 1,
    });
    return result;
});
exports.getPostByStoreIdService = getPostByStoreIdService;
//== get Post by brand Id
const getPostByBrandIdService = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find({ brand: brandId }).populate("brand", {
        brandName: 1,
        brandPhotoURL: 1,
    });
    return result;
});
exports.getPostByBrandIdService = getPostByBrandIdService;
//== get Post by campaign Id
const getPostByCampaignIdService = (campaignId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find({ campaign: campaignId }).populate("campaign", {
        campaignName: 1,
        campaignPhotoURL: 1,
    });
    return result;
});
exports.getPostByCampaignIdService = getPostByCampaignIdService;
//== get Post by brand Id
const getPostByCategoryIdService = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find({ category: categoryId }).populate("category", {
        categoryName: 1,
    });
    return result;
});
exports.getPostByCategoryIdService = getPostByCategoryIdService;
//== get Post by brand Id
const getPostByNetworkIdService = (networkId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.find({ network: networkId }).populate("network", {
        networkName: 1,
    });
    return result;
});
exports.getPostByNetworkIdService = getPostByNetworkIdService;
// update countries to all related fields
// export const createNewPostUpdateCountriesToAllRelatedFields = async (
//   payload: IPost,
//   session: mongoose.mongo.ClientSession
// ) => {
//   const postCountries = payload.countries;
//   await Store.findOneAndUpdate(
//     { _id: payload.store.moreAboutStore },
//     { $addToSet: { storeCountries: { $each: postCountries } } },
//     { upsert: true, new: true, session }
//   );
//   if (payload.brand?.moreAboutBrand) {
//     await Brand.findOneAndUpdate(
//       { _id: payload.brand.moreAboutBrand },
//       { $addToSet: { brandCountries: { $each: postCountries } } },
//       { upsert: true, new: true, session }
//     );
//   }
//   if (payload.category?.moreAboutCategory) {
//     await Category.findOneAndUpdate(
//       { _id: payload.category.moreAboutCategory },
//       { $addToSet: { categoryCountries: { $each: postCountries } } },
//       { upsert: true, new: true, session }
//     );
//   }
//   if (payload.campaign?.moreAboutCampaign) {
//     await Campaign.findOneAndUpdate(
//       { _id: payload.campaign.moreAboutCampaign },
//       { $addToSet: { campaignCountries: { $each: postCountries } } },
//       { upsert: true, new: true, session }
//     );
//   }
//   if (payload.network?.moreAboutNetwork) {
//     await Network.findOneAndUpdate(
//       { _id: payload.network.moreAboutNetwork },
//       { $addToSet: { networkCountries: { $each: postCountries } } },
//       { upsert: true, new: true, session }
//     );
//   }
// };
