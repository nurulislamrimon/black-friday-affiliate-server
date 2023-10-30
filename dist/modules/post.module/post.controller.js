"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyPostController = exports.deleteAPostController = exports.revealedAPostController = exports.updateAPostController = exports.getAllActivePostsController = exports.getAllPostsByAdminController = exports.getAPostController = exports.searchGloballyAdminController = exports.searchGloballyClientController = exports.addNewPostController = void 0;
const PostServices = __importStar(require("./post.services"));
const user_services_1 = require("../user.module/user.services");
const mongoose_1 = require("mongoose");
const store_services_1 = require("../store.module/store.services");
const brand_services_1 = require("../brand.module/brand.services");
const category_services_1 = require("../category.module/category.services");
const campaign_services_1 = require("../campaign.module/campaign.services");
const network_services_1 = require("../network.module/network.services");
// add new Post controller
const addNewPostController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postTitle, storeName, brandName, categoryName, campaignName, networkName, expireDate, countries, postType, } = req.body;
        if (!postTitle ||
            !storeName ||
            !brandName ||
            !categoryName ||
            !campaignName ||
            !expireDate ||
            !countries ||
            !postType) {
            throw new Error("Please enter required information:  postTitle, storeName, brandName, categoryName, campaignName, expireDate, countries, postType!");
        }
        else {
            const postBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
            const isStoreExist = yield (0, store_services_1.getStoreByStoreNameService)(storeName);
            const isBrandExist = yield (0, brand_services_1.getBrandByBrandNameService)(brandName);
            const isCategoryExist = yield (0, category_services_1.getCategoryByCategoryNameService)(categoryName);
            const isCampaignExist = yield (0, campaign_services_1.getCampaignByCampaignNameService)(campaignName);
            if (!isStoreExist) {
                throw new Error("Invalid store name!");
            }
            else if (!isBrandExist) {
                throw new Error("Invalid brand name!");
            }
            else if (!isCategoryExist) {
                throw new Error("Invalid category name!");
            }
            else if (!isCampaignExist) {
                throw new Error("Invalid Campaign name!");
            }
            else {
                const newPost = Object.assign(Object.assign({}, req.body), { store: isStoreExist._id, brand: isBrandExist._id, category: isCategoryExist._id, campaign: isCampaignExist._id, postBy: Object.assign(Object.assign({}, postBy === null || postBy === void 0 ? void 0 : postBy.toObject()), { moreAboutUser: postBy === null || postBy === void 0 ? void 0 : postBy._id }) });
                if (networkName) {
                    const isNetworkExist = yield (0, network_services_1.getNetworkByNetworkNameService)(networkName);
                    if (!isNetworkExist) {
                        throw new Error("Invalid network name!");
                    }
                    else {
                        newPost.network = isNetworkExist._id;
                    }
                }
                const result = yield PostServices.addNewPostService(newPost);
                res.send({
                    success: true,
                    data: result,
                });
                console.log(`Post ${result._id} is added!`);
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addNewPostController = addNewPostController;
// add new Post controller
const searchGloballyClientController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield PostServices.searchGloballyClientService(req.query);
        res.send({
            success: true,
            data: result,
        });
        console.log(`global search is responsed!`);
    }
    catch (error) {
        next(error);
    }
});
exports.searchGloballyClientController = searchGloballyClientController;
const searchGloballyAdminController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield PostServices.searchGloballyAdminService(req.query);
        res.send({
            success: true,
            data: result,
        });
        console.log(`global search is responsed!`);
    }
    catch (error) {
        next(error);
    }
});
exports.searchGloballyAdminController = searchGloballyAdminController;
// get a Post controller
const getAPostController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = new mongoose_1.Types.ObjectId(req.params.id);
        const result = yield PostServices.getPostByIdService(postId);
        if (!result) {
            throw new Error("Post not found!");
        }
        else {
            res.send({
                success: true,
                data: result,
            });
            console.log(`Post ${result._id} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAPostController = getAPostController;
// get all Posts
const getAllPostsByAdminController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield PostServices.getAllPosts(req.query, false);
        res.send(Object.assign({ success: true }, result));
        console.log(`${(_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length} Posts are responsed!`);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPostsByAdminController = getAllPostsByAdminController;
// get all active Posts
const getAllActivePostsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const result = yield PostServices.getAllPosts(req.query, true);
        res.send(Object.assign({ success: true }, result));
        console.log(`${(_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.length} Posts are responsed!`);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllActivePostsController = getAllActivePostsController;
// update a Post controller
const updateAPostController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = new mongoose_1.Types.ObjectId(req.params.id);
        const existPost = yield PostServices.getPostByIdService(postId);
        if (!existPost) {
            throw new Error("Post doesn't exist!");
        }
        else {
            const updateBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
            const result = yield PostServices.updateAPostService(postId, Object.assign(Object.assign({}, req.body), { existPost, updateBy: Object.assign(Object.assign({}, updateBy === null || updateBy === void 0 ? void 0 : updateBy.toObject()), { moreAboutUser: updateBy === null || updateBy === void 0 ? void 0 : updateBy._id }) }));
            res.send({
                success: true,
                data: result,
            });
            console.log(`Post ${result} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateAPostController = updateAPostController;
// revealed a Post controller
const revealedAPostController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = new mongoose_1.Types.ObjectId(req.params.id);
        const existPost = yield PostServices.getPostByIdService(postId);
        if (!existPost) {
            throw new Error("Post doesn't exist!");
        }
        else {
            const result = yield PostServices.revealedAPostService(postId);
            res.send({
                success: true,
                data: result,
            });
            console.log(`Post ${result} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.revealedAPostController = revealedAPostController;
// update a Post controller
const deleteAPostController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = new mongoose_1.Types.ObjectId(req.params.id);
        const existPost = yield PostServices.getPostByIdService(postId);
        if (!existPost) {
            throw new Error("Post doesn't exist!");
        }
        else {
            const result = yield PostServices.deleteAPostService(postId);
            res.send({
                success: true,
                data: result,
            });
            console.log(`Post ${result} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAPostController = deleteAPostController;
// update a Post controller
const deleteManyPostController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postIds = req.body.posts;
        if (!postIds) {
            throw new Error("posts are required!");
        }
        const result = yield PostServices.deleteManyPostService(postIds);
        res.send({
            success: true,
            data: result,
        });
        console.log(`Post ${result} is added!`);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteManyPostController = deleteManyPostController;
