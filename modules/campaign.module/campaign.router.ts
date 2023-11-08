import express from "express";
import * as campaignController from "./campaign.controller";
import { verify_token } from "../../middlewares/verify_token";
import { verify_authorization } from "../../middlewares/verify_authorization";
import { roles } from "../../utils/constants/authorization_roles";

const campaignRouter = express.Router();

/**
 *@api{get}/ get all Campaign
 *@apiDescription get all Campaigns
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all Campaigns.
 *@apiError 401, 403 unauthorized & forbidden
 */
campaignRouter.get("/", campaignController.getAllCampaignsClientController);

/**
 *@api{get}/all get all Campaign
 *@apiDescription get all Campaigns
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all Campaigns.
 *@apiError 401, 403 unauthorized & forbidden
 */
campaignRouter.get(
  "/all",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  campaignController.getAllCampaignsAdminController
);
/**
 *@api{get}/:id get a Campaign by id
 *@apiDescription get a Campaign by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId Campaign
 *@apiQuery none
 *@apiSuccess {Object} Campaign.
 *@apiError Campaign not found
 */
campaignRouter.get(
  "/name/:CampaignName",
  campaignController.getACampaignByCampaignNameController
);

/**
 *@api{get}/:id get a Campaign by id
 *@apiDescription get a Campaign by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId Campaign
 *@apiQuery none
 *@apiSuccess {Object} Campaign.
 *@apiError Campaign not found
 */
campaignRouter.get("/:id", campaignController.getACampaignController);

/**
 *@api{post}/add add new Campaign
 *@apiDescription add a new Campaign
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody photoURL, CampaignName, countries,CampaignExternalLink, description, howToUse
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} added Campaign.
 *@apiError 401, 403 unauthorized & forbidden
 */
campaignRouter.post(
  "/add",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  campaignController.addNewCampaignController
);

/**
 *@api{put}/:id update a Campaign
 *@apiDescription update a Campaign by id with validation
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of Campaign
 *@apiQuery none
 *@apiSuccess {Object} update info of the Campaign.
 *@apiError 401, 403 unauthorized & forbidden
 */
campaignRouter.patch(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  campaignController.updateACampaignController
);
/**
 *@api{delete}/:id delete a Campaign
 *@apiDescription delete a Campaign by id
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of Campaign
 *@apiQuery none
 *@apiSuccess {Object} delete confirmation.
 *@apiError 401, 403 unauthorized & forbidden
 */
campaignRouter.delete(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  campaignController.deleteACampaignController
);

export default campaignRouter;
