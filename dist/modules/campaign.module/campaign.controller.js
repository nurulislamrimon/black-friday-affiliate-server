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
exports.deleteACampaignController = exports.updateACampaignController = exports.getAllCampaignsController = exports.addNewCampaignController = exports.getAllActiveCampaignsController = exports.getACampaignByCampaignNameController = exports.getACampaignController = void 0;
const campaignServices = __importStar(require("./campaign.services"));
const user_services_1 = require("../user.module/user.services");
const mongoose_1 = require("mongoose");
const post_services_1 = require("../post.module/post.services");
const catchAsync_1 = __importDefault(require("../../Shared/catchAsync"));
// get Campaign by Id controller
exports.getACampaignController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const campaignId = new mongoose_1.Types.ObjectId(req.params.id);
    const result = yield campaignServices.getCampaignByIdService(campaignId);
    if (!result) {
        throw new Error("Campaign not found!");
    }
    else {
        res.send({
            success: true,
            data: result,
        });
    }
}));
// get Campaign by Id controller
exports.getACampaignByCampaignNameController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const campaignName = req.params.CampaignName;
    const result = yield campaignServices.getCampaignByCampaignNameService(campaignName);
    if (!result) {
        throw new Error("Campaign not found!");
    }
    else {
        res.send({
            success: true,
            data: result,
        });
    }
}));
// get all active Campaigns
exports.getAllActiveCampaignsController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield campaignServices.getAllActiveCampaigns(req.query);
    res.send(Object.assign({ success: true }, result));
    console.log(`${(_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length} Campaigns are responsed!`);
}));
// add new Campaign controller
exports.addNewCampaignController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignPhotoURL, campaignName } = req.body;
    const existCampaign = yield campaignServices.getCampaignByCampaignNameService(campaignName);
    if (!campaignPhotoURL || !campaignName) {
        throw new Error("Please enter required information:  campaignName, campaignPhotoURL!");
    }
    else if ((existCampaign === null || existCampaign === void 0 ? void 0 : existCampaign.campaignName) === campaignName) {
        throw new Error("Campaign already exist!");
    }
    else {
        const postBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
        const result = yield campaignServices.addNewCampaignService(Object.assign(Object.assign({}, req.body), { postBy: Object.assign(Object.assign({}, postBy === null || postBy === void 0 ? void 0 : postBy.toObject()), { moreAboutUser: postBy === null || postBy === void 0 ? void 0 : postBy._id }) }));
        res.send({
            success: true,
            data: result,
        });
        console.log(`Campaign ${result._id} is added!`);
    }
}));
// get all Campaigns
exports.getAllCampaignsController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield campaignServices.getAllCampaigns(req.query);
    res.send(Object.assign({ success: true }, result));
    console.log(`${(_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.length} Campaigns are responsed!`);
}));
// update a Campaign controller
exports.updateACampaignController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = new mongoose_1.Types.ObjectId(req.params.id);
    const existCampaign = yield campaignServices.getCampaignByIdService(postId);
    if (!existCampaign) {
        throw new Error("Campaign doesn't exist!");
    }
    else {
        const updateBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
        const result = yield campaignServices.updateACampaignService(postId, Object.assign(Object.assign({}, req.body), { existCampaign, updateBy: Object.assign(Object.assign({}, updateBy === null || updateBy === void 0 ? void 0 : updateBy.toObject()), { moreAboutUser: updateBy === null || updateBy === void 0 ? void 0 : updateBy._id }) }));
        res.send({
            success: true,
            data: result,
        });
        console.log(`Campaign ${result} is added!`);
    }
}));
// update a Campaign controller
exports.deleteACampaignController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const CampaignId = new mongoose_1.Types.ObjectId(req.params.id);
    const existCampaign = yield campaignServices.getCampaignByIdService(CampaignId);
    const isRelatedPostExist = yield (0, post_services_1.getPostByCampaignIdService)(CampaignId);
    if (!existCampaign) {
        throw new Error("Campaign doesn't exist!");
    }
    else if (isRelatedPostExist.length) {
        throw new Error("Sorry! This Campaign has some posts, You can't delete the Campaign!");
    }
    else {
        const result = yield campaignServices.deleteACampaignService(CampaignId);
        res.send({
            success: true,
            data: result,
        });
        console.log(`Campaign ${result} is added!`);
    }
}));
