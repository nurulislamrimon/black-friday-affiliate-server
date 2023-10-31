import express from "express";
import * as networkController from "./network.controller";
import { verify_token } from "../../middlewares/verify_token";
import { verify_authorization } from "../../middlewares/verify_authorization";
import { roles } from "../../utils/constants/authorization_roles";

const networkRouter = express.Router();

/**
 *@api{get}/ get all Network
 *@apiDescription get all Networks
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all Networks.
 *@apiError 401, 403 unauthorized & forbidden
 */
networkRouter.get("/", networkController.getAllNetworksController);

/**
 *@api{get}/:id get a Network by id
 *@apiDescription get a Network by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId Network
 *@apiQuery none
 *@apiSuccess {Object} Network.
 *@apiError Network not found
 */
networkRouter.get(
  "/name/:networkName",
  networkController.getANetworkByNetworkNameController
);

/**
 *@api{get}/:id get a Network by id
 *@apiDescription get a Network by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId Network
 *@apiQuery none
 *@apiSuccess {Object} Network.
 *@apiError Network not found
 */
networkRouter.get("/:id", networkController.getANetworkByIdController);

/**
 *@api{post}/add add new Network
 *@apiDescription add a new Network
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody photoURL, NetworkName, countries,NetworkExternalLink, description, howToUse
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} added Network.
 *@apiError 401, 403 unauthorized & forbidden
 */
networkRouter.post(
  "/add",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  networkController.addNewNetworkController
);

/**
 *@api{put}/:id update a Network
 *@apiDescription update a Network by id with validation
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of Network
 *@apiQuery none
 *@apiSuccess {Object} update info of the Network.
 *@apiError 401, 403 unauthorized & forbidden
 */
networkRouter.patch(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  networkController.updateANetworkController
);
/**
 *@api{delete}/:id delete a Network
 *@apiDescription delete a Network by id
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of Network
 *@apiQuery none
 *@apiSuccess {Object} delete confirmation.
 *@apiError 401, 403 unauthorized & forbidden
 */
networkRouter.delete(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  networkController.deleteANetworkController
);

export default networkRouter;
