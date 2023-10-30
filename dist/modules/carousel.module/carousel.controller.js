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
exports.addNewCarouselController = exports.getCarouselController = void 0;
const carouselServices = __importStar(require("./carousel.services"));
const user_services_1 = require("../user.module/user.services");
const mongoose_1 = require("mongoose");
// get carousel controller
const getCarouselController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield carouselServices.getCarouselService("-updateBy -postBy");
        res.send({
            success: true,
            data: result,
        });
        console.log(`carousel ${result === null || result === void 0 ? void 0 : result._id} is added!`);
    }
    catch (error) {
        next(error);
    }
});
exports.getCarouselController = getCarouselController;
// add new carousel controller
const addNewCarouselController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { carousel } = req.body;
        if (!carousel) {
            throw new Error("Please enter required information!");
        }
        else {
            const isACarouselExist = (yield carouselServices.getCarouselService(""));
            let result;
            if (!isACarouselExist) {
                const postBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
                result = yield carouselServices.addNewCarouselService(Object.assign(Object.assign({}, req.body), { postBy: Object.assign(Object.assign({}, postBy === null || postBy === void 0 ? void 0 : postBy.toObject()), { moreAboutUser: postBy === null || postBy === void 0 ? void 0 : postBy._id }) }));
            }
            else {
                const id = new mongoose_1.Types.ObjectId(isACarouselExist === null || isACarouselExist === void 0 ? void 0 : isACarouselExist._id);
                const updateBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
                result = yield carouselServices.updateCarouselByIdService(id, Object.assign(Object.assign({}, req.body), { updateBy: Object.assign(Object.assign({}, updateBy === null || updateBy === void 0 ? void 0 : updateBy.toObject()), { moreAboutUser: updateBy === null || updateBy === void 0 ? void 0 : updateBy._id }) }));
            }
            res.send({
                success: true,
                data: result,
            });
            console.log(`carousel ${result === null || result === void 0 ? void 0 : result._id} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addNewCarouselController = addNewCarouselController;
