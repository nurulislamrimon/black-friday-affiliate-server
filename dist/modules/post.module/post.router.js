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
const PostController = __importStar(require("./post.controller"));
const verify_token_1 = require("../../middlewares/verify_token");
const verify_authorization_1 = require("../../middlewares/verify_authorization");
const authorization_roles_1 = require("../../utils/constants/authorization_roles");
const postRouter = express_1.default.Router();
/**
 *@api{post}/add add new Post
 *@apiDescription add a new Post
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody postTitle, storeName, postType, expireDate, isVerified, couponCode, externalLink, postDescription,
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} added Post.
 *@apiError 401, 403 unauthorized & forbidden
 */
postRouter.post("/add", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), PostController.addNewPostController);
/**
 *@api{get}/ get all Post
 *@apiDescription get all Posts
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all Posts.
 *@apiError 401, 403 unauthorized & forbidden
 */
postRouter.get("/", PostController.getAllActivePostsController);
/**
 *@api{get}/all get all Post
 *@apiDescription get all Posts
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all Posts.
 *@apiError 401, 403 unauthorized & forbidden
 */
postRouter.get("/all", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), PostController.getAllPostsByAdminController);
/**
 *@api{get}/search/:key make a global search on post
 *@apiDescription get all Posts and others
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam string
 *@apiQuery none
 *@apiSuccess {Array of Object} all Posts and others.
 *@apiError not found
 */
postRouter.get("/search", PostController.searchGloballyClientController);
/**
 *@api{get}/search/all/:key make a global search on post
 *@apiDescription get all Posts and others
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam string
 *@apiQuery none
 *@apiSuccess {Array of Object} all Posts and others.
 *@apiError not found
 */
postRouter.get("/search/all", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), PostController.searchGloballyAdminController);
/**
 *@api{GET}/:id get a Post by id
 *@apiDescription get a post by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId
 *@apiQuery none
 *@apiSuccess {Object} get post.
 *@apiError post not found
 */
postRouter.get("/:id", PostController.getAPostController);
/**
 *@api{put}/revealed/:id update a Post
 *@apiDescription revealed again
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId of Post
 *@apiQuery none
 *@apiSuccess {Object} update info of the Post.
 *@apiError 401, 403 unauthorized & forbidden
 */
postRouter.patch("/revealed/:id", PostController.revealedAPostController);
/**
 *@api{put}/:id update a Post
 *@apiDescription update a Post by id with validation
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of Post
 *@apiQuery none
 *@apiSuccess {Object} update info of the Post.
 *@apiError 401, 403 unauthorized & forbidden
 */
postRouter.patch("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), PostController.updateAPostController);
/**
 *@api{delete}/many delete many Post
 *@apiDescription delete many Post by id
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} delete confirmation.
 *@apiError 401, 403 unauthorized & forbidden
 */
postRouter.delete("/many", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), PostController.deleteManyPostController);
/**
 *@api{delete}/:id delete a Post
 *@apiDescription delete a Post by id
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of Post
 *@apiQuery none
 *@apiSuccess {Object} delete confirmation.
 *@apiError 401, 403 unauthorized & forbidden
 */
postRouter.delete("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), PostController.deleteAPostController);
exports.default = postRouter;
