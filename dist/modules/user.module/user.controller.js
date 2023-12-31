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
exports.setNotificationReadedController = exports.getNotificationController = exports.getUnreadedNotificationCountController = exports.addAndRemovePostFromFavouriteController = exports.addAndRemoveStoreFromFavouriteController = exports.getAllFavouritePostController = exports.getAllFavouriteStoreController = exports.getAllUserController = exports.updateAboutMeUserController = exports.getAboutMeUserController = exports.refreshUserController = exports.loginUserController = void 0;
const userServices = __importStar(require("./user.services"));
const generate_token_1 = require("../../utils/generate_token");
const mongoose_1 = require("mongoose");
const store_services_1 = require("../store.module/store.services");
const post_services_1 = require("../post.module/post.services");
const get_payload_from_token_1 = require("../../utils/get_payload_from_token");
const catchAsync_1 = __importDefault(require("../../Shared/catchAsync"));
exports.loginUserController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, uid, picture } = req.user;
    const { country, phoneNumber } = req.body;
    const existUser = yield userServices.getUserByEmailService(email);
    let newUser;
    let accessToken;
    if (!existUser) {
        newUser = yield userServices.addNewUserService({
            email,
            name,
            country,
            phoneNumber,
            uid,
            photoURL: picture,
        });
    }
    else {
        accessToken = (0, generate_token_1.generate_token)({ email: email });
        const refreshToken = (0, generate_token_1.generate_token)({ email: email }, "365d", process.env.refresh_key);
        const cookieOptions = {
            secure: true,
            expires: new Date(Date.now() + 50000),
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
        res.send({
            success: true,
            refreshToken,
            data: { user: existUser || newUser, accessToken },
        });
        console.log(`user ${existUser._id} is responsed!`);
    }
}));
exports.refreshUserController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRefreshTokenFromCookies = req.cookies.refreshToken;
    const userRefreshTokenFromHeader = req.headers.cookies;
    if (!userRefreshTokenFromCookies && !userRefreshTokenFromHeader) {
        throw new Error("Refresh token not found");
    }
    const payload = (0, get_payload_from_token_1.getPayloadFromToken)(userRefreshTokenFromCookies || userRefreshTokenFromHeader, process.env.refresh_key);
    const accessToken = (0, generate_token_1.generate_token)({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    res.send({
        success: true,
        data: { accessToken },
    });
    console.log(`New access token created from refresh token`);
}));
// about me by token
exports.getAboutMeUserController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.decoded.email;
    const result = yield userServices.getUserByEmailService(email);
    if (!result) {
        throw new Error("User not found!");
    }
    else {
        res.send({
            success: true,
            data: result,
        });
        console.log(`user responsed!`);
    }
}));
// update me from token
exports.updateAboutMeUserController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.body.decoded.email;
    const isUserExist = yield userServices.getUserByEmailService(userEmail);
    if (!isUserExist) {
        throw new Error("User not found!");
    }
    const _a = req.body, { newPosts, favourite, email } = _a, rest = __rest(_a, ["newPosts", "favourite", "email"]);
    const result = yield userServices.updateMeByEmailService(isUserExist._id, rest);
    res.send({
        success: true,
        data: result,
    });
}));
// get all user
exports.getAllUserController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield userServices.getAllUserService(req.query);
    res.send(Object.assign({ success: true }, result));
    console.log(`${(_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.length} user responsed!`);
}));
// get all favourite stores
exports.getAllFavouriteStoreController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userServices.getFavouriteStoreService(req.body.decoded.email);
    res.send({
        success: true,
        result,
    });
    console.log(`${result === null || result === void 0 ? void 0 : result._id} favourite stores responsed!`);
}));
// get all favourite posts
exports.getAllFavouritePostController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userServices.getFavouritePostService(req.body.decoded.email);
    res.send({
        success: true,
        result,
    });
    console.log(`${result === null || result === void 0 ? void 0 : result._id} favourite posts responsed!`);
}));
// get add favourite stores
exports.addAndRemoveStoreFromFavouriteController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const storeId = new mongoose_1.Types.ObjectId(req.params.id);
    const isStoreExist = yield (0, store_services_1.getStoreByIdService)(storeId);
    if (!isStoreExist) {
        throw new Error("Sorry, Store doesn't exist!");
    }
    else {
        const result = yield userServices.addAndRemoveStoreFromFavouriteService(req.body.decoded.email, storeId);
        res.send({
            success: true,
            result,
        });
        console.log(`Store favourite list modified!`);
    }
}));
// get add favourite stores
exports.addAndRemovePostFromFavouriteController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const PostId = new mongoose_1.Types.ObjectId(req.params.id);
    const isPostExist = yield (0, post_services_1.getPostByIdService)(PostId);
    if (!isPostExist) {
        throw new Error("Sorry, Post doesn't exist!");
    }
    else {
        const result = yield userServices.addAndRemovePostFromFavouriteService(req.body.decoded.email, PostId);
        res.send({
            success: true,
            result,
        });
        console.log(`Post favourite list modified!`);
    }
}));
// get all notification counted
exports.getUnreadedNotificationCountController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userServices.getUnreadedNotificationCountService(req.body.decoded.email);
    res.send({
        success: true,
        data: result,
    });
    console.log(`${result} user responsed!`);
}));
// get all notifications
exports.getNotificationController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userServices.getNotificationService(req.body.decoded.email);
    res.send({
        success: true,
        data: result,
    });
    console.log(`${result === null || result === void 0 ? void 0 : result._id} user responsed!`);
}));
// set post status to readed
exports.setNotificationReadedController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = new mongoose_1.Types.ObjectId(req.params.id);
    const result = yield userServices.setNotificationReadedService(req.body.decoded.email, postId);
    res.send({
        success: true,
        data: result,
    });
    console.log(`notification ${postId} is readed!`);
}));
