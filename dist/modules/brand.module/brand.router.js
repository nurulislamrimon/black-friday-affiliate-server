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
const brandController = __importStar(require("./brand.controller"));
const verify_token_1 = require("../../middlewares/verify_token");
const verify_authorization_1 = require("../../middlewares/verify_authorization");
const authorization_roles_1 = require("../../utils/constants/authorization_roles");
const brandRouter = express_1.default.Router();
/**
 *@api{get}/ get all Brand
 *@apiDescription get all Brands
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all Brands.
 *@apiError 401, 403 unauthorized & forbidden
 */
brandRouter.get("/", brandController.getAllBrandsClientController);
/**
 *@api{get}/all get all Brand
 *@apiDescription get all Brands
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all Brands.
 *@apiError 401, 403 unauthorized & forbidden
 */
brandRouter.get("/all", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), brandController.getAllBrandsAdminController);
/**
 *@api{get}/:id get a Brand by id
 *@apiDescription get a Brand by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId Brand
 *@apiQuery none
 *@apiSuccess {Object} Brand.
 *@apiError Brand not found
 */
brandRouter.get("/name/:BrandName", brandController.getABrandByBrandNameController);
/**
 *@api{get}/:id get a Brand by id
 *@apiDescription get a Brand by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId Brand
 *@apiQuery none
 *@apiSuccess {Object} Brand.
 *@apiError Brand not found
 */
brandRouter.get("/:id", brandController.getABrandController);
/**
 *@api{post}/add add new Brand
 *@apiDescription add a new Brand
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody photoURL, BrandName, country,BrandExternalLink, description, howToUse
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} added Brand.
 *@apiError 401, 403 unauthorized & forbidden
 */
brandRouter.post("/add", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), brandController.addNewBrandController);
/**
 *@api{put}/:id update a Brand
 *@apiDescription update a Brand by id with validation
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of Brand
 *@apiQuery none
 *@apiSuccess {Object} update info of the Brand.
 *@apiError 401, 403 unauthorized & forbidden
 */
brandRouter.patch("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), brandController.updateABrandController);
/**
 *@api{delete}/:id delete a Brand
 *@apiDescription delete a Brand by id
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of Brand
 *@apiQuery none
 *@apiSuccess {Object} delete confirmation.
 *@apiError 401, 403 unauthorized & forbidden
 */
brandRouter.delete("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), brandController.deleteABrandController);
exports.default = brandRouter;
