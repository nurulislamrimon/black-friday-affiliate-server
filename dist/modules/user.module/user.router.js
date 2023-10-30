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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("./user.controller"));
const verify_token_1 = require("../../middlewares/verify_token");
const verify_authorization_1 = require("../../middlewares/verify_authorization");
const verify_google_token_1 = __importDefault(require("../../middlewares/verify_google_token"));
const authorization_roles_1 = require("../../utils/constants/authorization_roles");
const userRouter = express_1.default.Router();
/**
 *@api{post}/login login an existing user
 *@apiDescription login with password or provider
 *@apiPermission none
 *@apiHeader none
 *@apiBody email, (password,confirmPassword||provider)
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} if password then user info and token else only user info.
 *@apiError user not found, Please signup first!
 *@apiError email or password incorrect!
 */
userRouter.post("/login", verify_google_token_1.default, userController.loginUserController);
/**
 *@api{post}/refresh accessToken from refreshToke
 *@apiDescription create an access Token using refresh token
 *@apiPermission none
 *@apiHeader none
 *@apiCookie refresh token
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} return new accessToken and set new refresh token to the cookie.
 *@apiError user not found, token not found
 */
userRouter.post("/refresh", userController.refreshUserController);
/**
 *@api{get}/me about a user
 *@apiDescription get information about a user by itself
 *@apiPermission none
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} about me
 *@apiError user not found!
 */
userRouter.get("/me", verify_token_1.verify_token, userController.getAboutMeUserController);
/**
 *@api{put}/me update about me
 *@apiDescription update self
 *@apiPermission none
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} about me
 *@apiError 404,400!
 */
userRouter.patch("/me", verify_token_1.verify_token, userController.updateAboutMeUserController);
/**
 *@api{get}/ get all user
 *@apiDescription get all users
 *@apiPermission admin and manager
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery {filters}, limit, skip, sort
 *@apiSuccess {Array of Object} about users
 *@apiError 401 & 403
 */
userRouter.get("/", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), userController.getAllUserController);
// ===================================================
// === =============Favourite============= ===
// ===================================================
/**
 *@api{get}/favourite/store get favourite stores
 *@apiDescription get all favourite stores with counted
 *@apiPermission user
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery {filters}
 *@apiSuccess {Array of Object} all favourite stores
 *@apiError 401 & 403
 */
userRouter.get("/favourite/store", verify_token_1.verify_token, userController.getAllFavouriteStoreController);
/**
 *@api{get}/favourite/post get favourite posts
 *@apiDescription get all favourite posts with counted
 *@apiPermission user
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery {filters}
 *@apiSuccess {Array of Object} all favourite posts
 *@apiError 401 & 403
 */
userRouter.get("/favourite/post", verify_token_1.verify_token, userController.getAllFavouritePostController);
/**
 *@api{put}/favourite/store/:id add and remove store from the favourite list.
 *@apiDescription add and remove store from the favourite list.
 *@apiPermission user
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} favourite stores
 *@apiError 401 & 403
 */
userRouter.patch("/favourite/store/:id", verify_token_1.verify_token, userController.addAndRemoveStoreFromFavouriteController);
/**
 *@api{put}/favourite/post/:id add and remove Post from the favourite list.
 *@apiDescription add and remove Post from the favourite list.
 *@apiPermission user
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} favourite Posts
 *@apiError 401 & 403
 */
userRouter.patch("/favourite/post/:id", verify_token_1.verify_token, userController.addAndRemovePostFromFavouriteController);
// ===================================================
// === =============notification============= ===
// ===================================================
/**
 *@api{get}/notification get notification
 *@apiDescription get all new posts counted
 *@apiPermission user
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery {filters}
 *@apiSuccess {Array of Object} about all posts
 *@apiError 401 & 403
 */
userRouter.get("/notification", verify_token_1.verify_token, userController.getUnreadedNotificationCountController);
/**
 *@api{get}/notification get notification
 *@apiDescription get all new posts with all information
 *@apiPermission user
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery {filters}
 *@apiSuccess {Array of Object} about all posts
 *@apiError 401 & 403
 */
userRouter.get("/notification/all", verify_token_1.verify_token, userController.getNotificationController);
/**
 *@api{put}/notification/readed/:id update a post notification status
 *@apiDescription set notification post status to readed
 *@apiPermission user
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery {filters}
 *@apiSuccess {Array of Object} about all posts
 *@apiError 401 & 403
 */
userRouter.patch("/notification/readed/:id", verify_token_1.verify_token, userController.setNotificationReadedController);
exports.default = userRouter;
