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
exports.deleteManyPostController = exports.deleteAPostController = exports.revealedAPostController = exports.updateAPostController = exports.getAllActivePostsController = exports.getAllPostsByAdminController = exports.getAPostController = exports.searchGloballyAdminController = exports.searchGloballyClientController = exports.addNewPostController = void 0;
const PostServices = __importStar(require("./post.services"));
const user_services_1 = require("../user.module/user.services");
const mongoose_1 = require("mongoose");
const catchAsync_1 = __importDefault(require("../../Shared/catchAsync"));
const store_services_1 = require("../store.module/store.services");
const checkIsExistAndGetFields_1 = require("../../utils/checkIsExistAndGetFields");
const brand_services_1 = require("../brand.module/brand.services");
const category_services_1 = require("../category.module/category.services");
const campaign_services_1 = require("../campaign.module/campaign.services");
const network_services_1 = require("../network.module/network.services");
// add new Post controller
exports.addNewPostController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postTitle, expireDate, countries, postType } = req.body;
    if (!postTitle || !expireDate || !countries || !postType) {
        throw new Error("Please enter required information:  postTitle, expireDate, countries, postType!");
    }
    else {
        const postBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
        const newPost = Object.assign(Object.assign({}, req.body), { store: { storeName: req.body.storeName }, brand: { brandName: req.body.brandName }, category: { categoryName: req.body.categoryName }, network: { networkName: req.body.networkName }, campaign: { campaignName: req.body.campaignName }, postBy: Object.assign(Object.assign({}, postBy === null || postBy === void 0 ? void 0 : postBy.toObject()), { moreAboutUser: postBy === null || postBy === void 0 ? void 0 : postBy._id }) });
        const result = yield PostServices.addNewPostService(newPost);
        res.send({
            success: true,
            data: result,
        });
        console.log(`Post ${result._id} is added!`);
    }
}));
// add new Post controller
exports.searchGloballyClientController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield PostServices.searchGloballyClientService(req.query);
    res.send({
        success: true,
        data: result,
    });
    console.log(`global search is responsed!`);
}));
exports.searchGloballyAdminController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield PostServices.searchGloballyAdminService(req.query);
    res.send({
        success: true,
        data: result,
    });
    console.log(`global search is responsed!`);
}));
// get a Post controller
exports.getAPostController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// get all Posts
exports.getAllPostsByAdminController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield PostServices.getAllPosts(req.query, false);
    res.send(Object.assign({ success: true }, result));
    console.log(`${(_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length} Posts are responsed!`);
}));
// get all active Posts
exports.getAllActivePostsController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield PostServices.getAllPosts(req.query, true);
    res.send(Object.assign({ success: true }, result));
    console.log(`${(_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.length} Posts are responsed!`);
}));
// update a Post controller
exports.updateAPostController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _c = req.body, { storeName, brandName, categoryName, campaignName, networkName } = _c, rest = __rest(_c, ["storeName", "brandName", "categoryName", "campaignName", "networkName"]);
    const postId = new mongoose_1.Types.ObjectId(req.params.id);
    const existPost = yield PostServices.getPostByIdService(postId);
    if (!existPost) {
        throw new Error("Post doesn't exist!");
    }
    else {
        const updateBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
        const updateData = Object.assign(Object.assign({}, rest), { existPost, updateBy: Object.assign(Object.assign({}, updateBy === null || updateBy === void 0 ? void 0 : updateBy.toObject()), { moreAboutUser: updateBy === null || updateBy === void 0 ? void 0 : updateBy._id }) });
        yield (0, checkIsExistAndGetFields_1.checkIsExistAndAddFields)("store", { storeName }, store_services_1.getStoreByStoreNameService, updateData);
        yield (0, checkIsExistAndGetFields_1.checkIsExistAndAddFields)("brand", { brandName }, brand_services_1.getBrandByBrandNameService, updateData);
        yield (0, checkIsExistAndGetFields_1.checkIsExistAndAddFields)("category", { categoryName }, category_services_1.getCategoryByCategoryNameService, updateData);
        yield (0, checkIsExistAndGetFields_1.checkIsExistAndAddFields)("campaign", { campaignName }, campaign_services_1.getCampaignByCampaignNameService, updateData);
        yield (0, checkIsExistAndGetFields_1.checkIsExistAndAddFields)("network", { networkName }, network_services_1.getNetworkByNetworkNameService, updateData);
        const result = yield PostServices.updateAPostService(postId, updateData);
        res.send({
            success: true,
            data: result,
        });
        console.log(`Post is updated!`);
    }
}));
// revealed a Post controller
exports.revealedAPostController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// update a Post controller
exports.deleteAPostController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// update a Post controller
exports.deleteManyPostController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
