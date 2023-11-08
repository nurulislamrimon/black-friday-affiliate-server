import express from "express";
import * as categoryController from "./category.controller";
import { verify_token } from "../../middlewares/verify_token";
import { verify_authorization } from "../../middlewares/verify_authorization";
import { roles } from "../../utils/constants/authorization_roles";

const categoryRouter = express.Router();

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
categoryRouter.get("/", categoryController.getAllCategoriesClientController);

/**
 *@api{get}/all get all category
 *@apiDescription get all categorys
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery query{name & others Properties},limit,sort,page
 *@apiSuccess {Array of Object} all categorys.
 *@apiError 401, 403 unauthorized & forbidden
 */
categoryRouter.get("/all", categoryController.getAllCategoriesAdminController);

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
categoryRouter.get(
  "/name/:categoryName",
  categoryController.getACategoryByCategoryNameController
);

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
categoryRouter.post(
  "/add",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  categoryController.addNewCategoryController
);

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
categoryRouter.patch(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  categoryController.updateACategoryController
);
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
categoryRouter.delete(
  "/:id",
  verify_token,
  verify_authorization(roles.SUPER_ADMIN, roles.ADMIN, roles.MANAGER) as any,
  categoryController.deleteACategoryController
);

export default categoryRouter;
