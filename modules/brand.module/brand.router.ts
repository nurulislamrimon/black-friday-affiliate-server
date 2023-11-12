import express from "express";
import * as brandController from "./brand.controller";
import { verify_token } from "../../middlewares/verify_token";
import { verify_authorization } from "../../middlewares/verify_authorization";
import { roles } from "../../utils/constants/authorization_roles";

const brandRouter = express.Router();

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
brandRouter.get(
  "/all",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  brandController.getAllBrandsAdminController
);
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
brandRouter.get(
  "/name/:BrandName",
  brandController.getABrandByBrandNameController
);

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
brandRouter.get("/:id", brandController.getBrandByIdController);

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
brandRouter.post(
  "/add",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  brandController.addNewBrandController
);

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
brandRouter.patch(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  brandController.updateABrandController
);

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
brandRouter.delete(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  brandController.deleteABrandController
);

export default brandRouter;
