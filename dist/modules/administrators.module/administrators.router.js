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
const administratorController = __importStar(require("./administrators.controller"));
const verify_token_1 = require("../../middlewares/verify_token");
const verify_authorization_1 = require("../../middlewares/verify_authorization");
const authorization_roles_1 = require("../../utils/constants/authorization_roles");
const administratorRouter = express_1.default.Router();
/**
 *@api{post}/add  add new administrator
 *@apiDescription add an administrator
 *@apiPermission admin & super admin only
 *@apiHeader accessToken
 *@apiBody email, role
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} email and role
 *@apiError Administrator already exist
 *@apiError 404,401
 */
administratorRouter.post("/add", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN), administratorController.addNewAdministratorController);
/**
 *@api{get}/ get all admin and managers
 *@apiDescription get all admin and managers
 *@apiPermission super admin, admin & manager
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Array of Object} get all admin and manager object
 *@apiError 401 & 403
 */
administratorRouter.get("/", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER), administratorController.getAllAdminAndManagerController);
/**
 *@api{get}/me get admin or manager information
 *@apiDescription get an admin or manager info
 *@apiPermission super admin, admin & manager
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} get admin and manager object
 *@apiError 401 & 403
 */
administratorRouter.get("/me", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN, authorization_roles_1.roles.MANAGER, authorization_roles_1.roles.INACTIVE), administratorController.getMeAdminAndManagerController);
/**
 *@api{put}/administrators/:id change role
 *@apiDescription change role of an administrator by using ObjectId
 *@apiPermission admin
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam ObjectId
 *@apiQuery none
 *@apiSuccess {Object} update info
 *@apiError 401 & 403
 */
administratorRouter.patch("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN), administratorController.updateAdministratorController);
/**
 *@api{delete}/administrators/:id delete an administrator
 *@apiDescription delete an administrator by using ObjectId
 *@apiPermission admin
 *@apiHeader access token with bearer
 *@apiBody none
 *@apiParam ObjectId
 *@apiQuery none
 *@apiSuccess {Object} update info
 *@apiError 401 & 403
 */
administratorRouter.delete("/:id", verify_token_1.verify_token, (0, verify_authorization_1.verify_authorization)(authorization_roles_1.roles.SUPER_ADMIN, authorization_roles_1.roles.ADMIN), administratorController.deleteAdministratorController);
exports.default = administratorRouter;
