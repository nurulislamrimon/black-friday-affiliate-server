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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteABrandController = exports.updateABrandController = exports.getAllBrandsController = exports.addNewBrandController = exports.getAllActiveBrandsController = exports.getABrandByBrandNameController = exports.getABrandController = void 0;
const BrandServices = __importStar(require("./brand.services"));
const user_services_1 = require("../user.module/user.services");
const mongoose_1 = require("mongoose");
const post_services_1 = require("../post.module/post.services");
const catchAsync_1 = __importDefault(require("../../Shared/catchAsync"));
// get Brand by Id controller
exports.getABrandController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const BrandId = new mongoose_1.Types.ObjectId(req.params.id);
    const result = yield BrandServices.getBrandByIdService(BrandId);
    if (!result) {
        throw new Error("Brand not found!");
    }
    else {
        res.send({
            success: true,
            data: result,
        });
    }
}));
// get Brand by Id controller
exports.getABrandByBrandNameController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const BrandName = req.params.BrandName;
    const result = yield BrandServices.getBrandByBrandNameService(BrandName);
    if (!result) {
        throw new Error("Brand not found!");
    }
    else {
        res.send({
            success: true,
            data: result,
        });
    }
}));
// get all active Brands
exports.getAllActiveBrandsController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield BrandServices.getAllActiveBrands(req.query);
    res.send(Object.assign({ success: true }, result));
    console.log(`${(_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length} Brands are responsed!`);
}));
// add new Brand controller
exports.addNewBrandController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { brandPhotoURL, brandName, countries } = req.body;
    const existBrand = yield BrandServices.getBrandByBrandNameService(brandName);
    if (!brandPhotoURL || !brandName || !countries) {
        throw new Error("Please enter required information: brandPhotoURL, brandName, countries!");
    }
    else if ((existBrand === null || existBrand === void 0 ? void 0 : existBrand.brandName) === brandName) {
        throw new Error("Brand already exist!");
    }
    else {
        const postBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
        const result = yield BrandServices.addNewBrandService(Object.assign(Object.assign({}, req.body), { postBy: Object.assign(Object.assign({}, postBy === null || postBy === void 0 ? void 0 : postBy.toObject()), { moreAboutUser: postBy === null || postBy === void 0 ? void 0 : postBy._id }) }));
        res.send({
            success: true,
            data: result,
        });
        console.log(`Brand ${result} is added!`);
    }
}));
// get all Brands
exports.getAllBrandsController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield BrandServices.getAllBrands(req.query);
    res.send(Object.assign({ success: true }, result));
    console.log(`${(_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.length} Brands are responsed!`);
}));
// update a Brand controller
exports.updateABrandController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = new mongoose_1.Types.ObjectId(req.params.id);
    const existBrand = yield BrandServices.getBrandByIdService(postId);
    if (!existBrand) {
        throw new Error("Brand doesn't exist!");
    }
    else {
        const updateBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
        const result = yield BrandServices.updateABrandService(postId, Object.assign(Object.assign({}, req.body), { existBrand, updateBy: Object.assign(Object.assign({}, updateBy === null || updateBy === void 0 ? void 0 : updateBy.toObject()), { moreAboutUser: updateBy === null || updateBy === void 0 ? void 0 : updateBy._id }) }));
        res.send({
            success: true,
            data: result,
        });
        console.log(`Brand ${result} is added!`);
    }
}));
// update a Brand controller
exports.deleteABrandController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const BrandId = new mongoose_1.Types.ObjectId(req.params.id);
    const existBrand = yield BrandServices.getBrandByIdService(BrandId);
    const isRelatedPostExist = yield (0, post_services_1.getPostByBrandIdService)(BrandId);
    if (!existBrand) {
        throw new Error("Brand doesn't exist!");
    }
    else if (isRelatedPostExist.length) {
        throw new Error("Sorry! This Brand has some posts, You can't delete the Brand!");
    }
    else {
        const result = yield BrandServices.deleteABrandService(BrandId);
        res.send({
            success: true,
            data: result,
        });
        console.log(`Brand ${result} is added!`);
    }
}));
