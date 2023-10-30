import express from "express";
import * as administratorController from "./administrators.controller";
import { verify_token } from "../../middlewares/verify_token";
import { verify_authorization } from "../../middlewares/verify_authorization";
import { roles } from "../../utils/constants/authorization_roles";

const administratorRouter = express.Router();
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
administratorRouter.post(
  "/add",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN) as any,
  administratorController.addNewAdministratorController
);

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
administratorRouter.get(
  "/",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  administratorController.getAllAdminAndManagerController
);
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
administratorRouter.get(
  "/me",
  verify_token,
  verify_authorization(
    roles.SUPER_ADMIN,
    roles.ADMIN,
    roles.MANAGER,
    roles.INACTIVE
  ) as any,
  administratorController.getMeAdminAndManagerController
);

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
administratorRouter.patch(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN) as any,
  administratorController.updateAdministratorController
);
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
administratorRouter.delete(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN) as any,
  administratorController.deleteAdministratorController
);

export default administratorRouter;
