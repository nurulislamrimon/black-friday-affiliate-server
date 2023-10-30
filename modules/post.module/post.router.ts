import express from "express";
import * as PostController from "./post.controller";
import { verify_token } from "../../middlewares/verify_token";
import { verify_authorization } from "../../middlewares/verify_authorization";
import { roles } from "../../utils/constants/authorization_roles";

const postRouter = express.Router();

/**
 *@api{post}/add add new Post
 *@apiDescription add a new Post
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody postTitle, storeName, postType, expireDate, countries, isVerified, couponCode, externalLink, postDescription,
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} added Post.
 *@apiError 401, 403 unauthorized & forbidden
 */
postRouter.post(
  "/add",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  PostController.addNewPostController
);

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
postRouter.get(
  "/all",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  PostController.getAllPostsByAdminController
);
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

postRouter.get(
  "/search/all",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  PostController.searchGloballyAdminController
);
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
postRouter.patch(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  PostController.updateAPostController
);
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
postRouter.delete(
  "/many",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  PostController.deleteManyPostController
);
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
postRouter.delete(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  PostController.deleteAPostController
);

export default postRouter;
