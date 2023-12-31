import express from "express";
import * as carouselController from "./carousel.controller";
import { verify_token } from "../../middlewares/verify_token";
import { verify_authorization } from "../../middlewares/verify_authorization";
import { roles } from "../../utils/constants/authorization_roles";

const carouselRouter = express.Router();

/**
 *@api{get}/carousel get carousel
 *@apiDescription get carousel
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} carousel
 *@apiError not found
 */
carouselRouter.get("/", carouselController.getCarouselController);

/**
 *@api{get}/carousel/:country get carousel
 *@apiDescription get carousel
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} carousel
 *@apiError not found
 */
carouselRouter.get(
  "/:country",
  carouselController.getCarouselByCountryController
);

/**
 *@api{put}/carousel/add add new carousel
 *@apiDescription add new carousel for the first time
 *@apiPermission admin and manager
 *@apiHeader token in headers with bearer
 *@apiBody full carousel
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} carousel
 *@apiError 401, 403 unauthorized & forbidden
 */
carouselRouter.post(
  "/add",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  carouselController.addNewCarouselController
);

/**
 *@api{patch}/carousel/update add new carousel
 *@apiDescription add new carousel for the first time
 *@apiPermission admin and manager
 *@apiHeader token in headers with bearer
 *@apiBody full carousel
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} carousel
 *@apiError 401, 403 unauthorized & forbidden
 */
carouselRouter.patch(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  carouselController.updateCarouselController
);

/**
 *@api{delete}/carousel/:id add new carousel
 *@apiDescription add new carousel for the first time
 *@apiPermission admin and manager
 *@apiHeader token in headers with bearer
 *@apiBody full carousel
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} carousel
 *@apiError 401, 403 unauthorized & forbidden
 */
carouselRouter.delete(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  carouselController.updateCarouselController
);

export default carouselRouter;
