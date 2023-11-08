import express from "express";
import * as storeController from "./store.controller";
import { verify_token } from "../../middlewares/verify_token";
import { verify_authorization } from "../../middlewares/verify_authorization";
import { roles } from "../../utils/constants/authorization_roles";

const storeRouter = express.Router();

/**
 *@api{post}/add add new store
 *@apiDescription add a new store
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody photoURL, storeName, storeExternalLink, description, howToUse
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} added store.
 *@apiError 401, 403 unauthorized & forbidden
 */
storeRouter.post(
  "/add",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  storeController.addNewStoreController
);

/**
 *@api{get}/ get all store
 *@apiDescription get all stores
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all stores.
 *@apiError 401, 403 unauthorized & forbidden
 */
storeRouter.get("/", storeController.getAllStoresClientController);

/**
 *@api{get}/all get all store
 *@apiDescription get all stores
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all stores.
 *@apiError 401, 403 unauthorized & forbidden
 */
storeRouter.get(
  "/all",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  storeController.getAllStoresAdminController
);

/**
 *@api{get}/:id get a store by id
 *@apiDescription get a store by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId store
 *@apiQuery none
 *@apiSuccess {Object} store.
 *@apiError store not found
 */
storeRouter.get(
  "/name/:storeName",
  storeController.getAStoreByStoreNameController
);

/**
 *@api{get}/:id get a store by id
 *@apiDescription get a store by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId store
 *@apiQuery none
 *@apiSuccess {Object} store.
 *@apiError store not found
 */
storeRouter.get("/:id", storeController.getAStoreController);

/**
 *@api{put}/:id update a store
 *@apiDescription update a store by id with validation
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of store
 *@apiQuery none
 *@apiSuccess {Object} update info of the store.
 *@apiError 401, 403 unauthorized & forbidden
 */
storeRouter.patch(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  storeController.updateAStoreController
);

/**
 *@api{delete}/:id delete a store
 *@apiDescription delete a store by id
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of store
 *@apiQuery none
 *@apiSuccess {Object} delete confirmation.
 *@apiError 401, 403 unauthorized & forbidden
 */
storeRouter.delete(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  storeController.deleteAStoreController
);

export default storeRouter;
