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
const networkController = __importStar(require("./network.controller"));
const verify_token_1 = require("../../middlewares/verify_token");
const verify_authorization_1 = require("../../middlewares/verify_authorization");
const authorization_roles_1 = require("../../utils/constants/authorization_roles");
const networkRouter = express_1.default.Router();
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
networkRouter.get("/name/:networkName", networkController.getANetworkByNetworkNameController);
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
networkRouter.post("/add", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), networkController.addNewNetworkController);
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
networkRouter.patch("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), networkController.updateANetworkController);
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
networkRouter.delete("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), networkController.deleteANetworkController);
exports.default = networkRouter;
