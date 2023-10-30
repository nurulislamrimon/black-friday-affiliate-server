import express from "express";
import * as ContactController from "./Contact.controller";
import { verify_token } from "../../middlewares/verify_token";
import { verify_authorization } from "../../middlewares/verify_authorization";
import { roles } from "../../utils/constants/authorization_roles";

const contactRouter = express.Router();

/**
 *@api{get}/Contact get Contact
 *@apiDescription get Contact
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} Contact
 *@apiError not found
 */
contactRouter.get("/", ContactController.getContactController);
/**
 *@api{put}/Contact/add add new Contact
 *@apiDescription add new Contact for the first time
 *@apiPermission admin and manager
 *@apiHeader token in headers with bearer
 *@apiBody full Contact
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} Contact
 *@apiError 401, 403 unauthorized & forbidden
 */
contactRouter.post(
  "/add",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  ContactController.addNewContactController
);

export default contactRouter;
