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
const storeController = __importStar(require("./store.controller"));
const verify_token_1 = require("../../middlewares/verify_token");
const verify_authorization_1 = require("../../middlewares/verify_authorization");
const authorization_roles_1 = require("../../utils/constants/authorization_roles");
const storeRouter = express_1.default.Router();
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
storeRouter.post("/add", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), storeController.addNewStoreController);
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
storeRouter.get("/all", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), storeController.getAllStoresAdminController);
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
storeRouter.get("/name/:storeName", storeController.getAStoreByStoreNameController);
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
storeRouter.patch("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), storeController.updateAStoreController);
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
storeRouter.delete("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), storeController.deleteAStoreController);
exports.default = storeRouter;
