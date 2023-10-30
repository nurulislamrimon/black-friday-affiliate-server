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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteACategoryController = exports.updateACategoryController = exports.getAllCategorysController = exports.addNewCategoryController = exports.getACategoryByIdController = exports.getACategoryByCategoryNameController = void 0;
const CategoryServices = __importStar(require("./category.services"));
const user_services_1 = require("../user.module/user.services");
const mongoose_1 = require("mongoose");
const post_services_1 = require("../post.module/post.services");
// get Category by Id controller
const getACategoryByCategoryNameController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryName = req.params.categoryName;
        const result = yield CategoryServices.getCategoryByCategoryNameService(categoryName);
        if (!result) {
            throw new Error("Category not found!");
        }
        else {
            res.send({
                success: true,
                data: result,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getACategoryByCategoryNameController = getACategoryByCategoryNameController;
// get Category by Id controller
const getACategoryByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CategoryId = new mongoose_1.Types.ObjectId(req.params.id);
        const result = yield CategoryServices.getCategoryByIdService(CategoryId);
        if (!result) {
            throw new Error("Category not found!");
        }
        else {
            res.send({
                success: true,
                data: result,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getACategoryByIdController = getACategoryByIdController;
// add new Category controller
const addNewCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName } = req.body;
        const existCategory = yield CategoryServices.getCategoryByCategoryNameService(categoryName);
        if (!categoryName) {
            throw new Error("Please enter required information: categoryName!");
        }
        else if ((existCategory === null || existCategory === void 0 ? void 0 : existCategory.categoryName) === categoryName) {
            throw new Error("Category already exist!");
        }
        else {
            const postBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
            const result = yield CategoryServices.addNewCategoryService(Object.assign(Object.assign({}, req.body), { postBy: Object.assign(Object.assign({}, postBy === null || postBy === void 0 ? void 0 : postBy.toObject()), { moreAboutUser: postBy === null || postBy === void 0 ? void 0 : postBy._id }) }));
            res.send({
                success: true,
                data: result,
            });
            console.log(`Category ${result._id} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addNewCategoryController = addNewCategoryController;
// get all Categorys
const getAllCategorysController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield CategoryServices.getAllCategorys(req.query);
        res.send(Object.assign({ success: true }, result));
        console.log(`${(_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length} Categorys are responsed!`);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCategorysController = getAllCategorysController;
// update a Category controller
const updateACategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = new mongoose_1.Types.ObjectId(req.params.id);
        const existCategory = yield CategoryServices.getCategoryByIdService(postId);
        if (!existCategory) {
            throw new Error("Category doesn't exist!");
        }
        else {
            const updateBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
            const result = yield CategoryServices.updateACategoryService(postId, Object.assign(Object.assign({}, req.body), { existCategory, updateBy: Object.assign(Object.assign({}, updateBy === null || updateBy === void 0 ? void 0 : updateBy.toObject()), { moreAboutUser: updateBy === null || updateBy === void 0 ? void 0 : updateBy._id }) }));
            res.send({
                success: true,
                data: result,
            });
            console.log(`Category ${result} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateACategoryController = updateACategoryController;
// update a Category controller
const deleteACategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const CategoryId = new mongoose_1.Types.ObjectId(req.params.id);
        const existCategory = yield CategoryServices.getCategoryByIdService(CategoryId);
        const isRelatedPostExist = yield (0, post_services_1.getPostByCategoryIdService)(CategoryId);
        if (!existCategory) {
            throw new Error("Category doesn't exist!");
        }
        else if (isRelatedPostExist.length) {
            throw new Error("Sorry! This Category has some posts, You can't delete the Category!");
        }
        else {
            const result = yield CategoryServices.deleteACategoryService(CategoryId);
            res.send({
                success: true,
                data: result,
            });
            console.log(`Category ${result} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteACategoryController = deleteACategoryController;
