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
const categoryController = __importStar(require("./category.controller"));
const verify_token_1 = require("../../middlewares/verify_token");
const verify_authorization_1 = require("../../middlewares/verify_authorization");
const authorization_roles_1 = require("../../utils/constants/authorization_roles");
const categoryRouter = express_1.default.Router();
/**
 *@api{get}/ get all category
 *@apiDescription get all categorys
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all categorys.
 *@apiError 401, 403 unauthorized & forbidden
 */
categoryRouter.get("/", categoryController.getAllCategorysController);
/**
 *@api{get}/:id get a category by id
 *@apiDescription get a category by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId category
 *@apiQuery none
 *@apiSuccess {Object} category.
 *@apiError category not found
 */
categoryRouter.get("/name/:categoryName", categoryController.getACategoryByCategoryNameController);
/**
 *@api{get}/:id get a category by id
 *@apiDescription get a category by id
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam ObjectId category
 *@apiQuery none
 *@apiSuccess {Object} category.
 *@apiError category not found
 */
categoryRouter.get("/:id", categoryController.getACategoryByIdController);
/**
 *@api{post}/add add new category
 *@apiDescription add a new category
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody photoURL, categoryName, categoryExternalLink, description, howToUse
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} added category.
 *@apiError 401, 403 unauthorized & forbidden
 */
categoryRouter.post("/add", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), categoryController.addNewCategoryController);
/**
 *@api{put}/:id update a category
 *@apiDescription update a category by id with validation
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of category
 *@apiQuery none
 *@apiSuccess {Object} update info of the category.
 *@apiError 401, 403 unauthorized & forbidden
 */
categoryRouter.patch("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), categoryController.updateACategoryController);
/**
 *@api{delete}/:id delete a category
 *@apiDescription delete a category by id
 *@apiPermission admin and manager
 *@apiHeader token
 *@apiBody none
 *@apiParam ObjectId of category
 *@apiQuery none
 *@apiSuccess {Object} delete confirmation.
 *@apiError 401, 403 unauthorized & forbidden
 */
categoryRouter.delete("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), categoryController.deleteACategoryController);
exports.default = categoryRouter;
