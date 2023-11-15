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
exports.deleteCarouselController = exports.updateCarouselController = exports.addNewCarouselController = exports.getCarouselByCountryController = exports.getCarouselController = void 0;
const carouselServices = __importStar(require("./carousel.services"));
const user_services_1 = require("../user.module/user.services");
const catchAsync_1 = __importDefault(require("../../Shared/catchAsync"));
const mongoose_1 = require("mongoose");
// get carousel controller
exports.getCarouselController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carouselServices.getCarouselService();
    res.send({
        success: true,
        data: result,
    });
    console.log(`carousel ${result === null || result === void 0 ? void 0 : result.length} is added!`);
}));
// get carousel controller
exports.getCarouselByCountryController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carouselServices.getCarouselByCountryService(req.params.country);
    res.send({
        success: true,
        data: result,
    });
    console.log(`carousel ${result === null || result === void 0 ? void 0 : result._id} is added!`);
}));
// add new carousel controller
exports.addNewCarouselController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { country, items } = req.body;
    if (!country || !items) {
        throw new Error("Please enter required information: country, items!");
    }
    else {
        const isACarouselExist = yield carouselServices.getCarouselByCountryService(country);
        if (isACarouselExist) {
            throw new Error("Carousel already exist!");
        }
        else {
            const postBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
            const result = yield carouselServices.addNewCarouselService(Object.assign(Object.assign({}, req.body), { postBy: Object.assign(Object.assign({}, postBy === null || postBy === void 0 ? void 0 : postBy.toObject()), { moreAboutUser: postBy === null || postBy === void 0 ? void 0 : postBy._id }) }));
            res.send({
                success: true,
                data: result,
            });
            console.log(`carousel ${result === null || result === void 0 ? void 0 : result._id} is added!`);
        }
    }
}));
// update carousel controller
exports.updateCarouselController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const carouselId = new mongoose_1.Types.ObjectId(req.params.id);
    const isCarouselExist = yield carouselServices.getCarouselByIdService(carouselId);
    if (!isCarouselExist) {
        throw new Error("Carousel not found!");
    }
    else {
        const updateBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
        const result = yield carouselServices.updateCarouselByIdService(carouselId, Object.assign(Object.assign({}, req.body), { existCarousel: isCarouselExist, updateBy: Object.assign(Object.assign({}, updateBy === null || updateBy === void 0 ? void 0 : updateBy.toObject()), { moreAboutUser: updateBy === null || updateBy === void 0 ? void 0 : updateBy._id }) }));
        res.send({
            success: true,
            data: result,
        });
        console.log(`carousel is updated!`);
    }
}));
// delete carousel controller
exports.deleteCarouselController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const carouselId = new mongoose_1.Types.ObjectId(req.params.id);
    const isCarouselExist = yield carouselServices.getCarouselByIdService(carouselId);
    if (!isCarouselExist) {
        throw new Error("Carousel not found!");
    }
    else {
        const result = yield carouselServices.deleteCarouselService(carouselId);
        res.send({
            success: true,
            data: result,
        });
        console.log(`carousel is deleted!`);
    }
}));
