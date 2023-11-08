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
const campaignController = __importStar(require("./campaign.controller"));
const verify_token_1 = require("../../middlewares/verify_token");
const verify_authorization_1 = require("../../middlewares/verify_authorization");
const authorization_roles_1 = require("../../utils/constants/authorization_roles");
const campaignRouter = express_1.default.Router();
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
campaignRouter.get("/all", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), campaignController.getAllCampaignsAdminController);
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
campaignRouter.get("/name/:CampaignName", campaignController.getACampaignByCampaignNameController);
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
campaignRouter.post("/add", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), campaignController.addNewCampaignController);
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
campaignRouter.patch("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), campaignController.updateACampaignController);
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
campaignRouter.delete("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), campaignController.deleteACampaignController);
exports.default = campaignRouter;
