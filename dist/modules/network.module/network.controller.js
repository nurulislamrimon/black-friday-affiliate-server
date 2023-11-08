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
exports.deleteANetworkController = exports.updateANetworkController = exports.getAllNetworksController = exports.addNewNetworkController = exports.getANetworkByIdController = exports.getANetworkByNetworkNameController = void 0;
const networkServices = __importStar(require("./network.services"));
const user_services_1 = require("../user.module/user.services");
const mongoose_1 = __importStar(require("mongoose"));
const post_services_1 = require("../post.module/post.services");
const catchAsync_1 = __importDefault(require("../../Shared/catchAsync"));
// get Network by Id controller
exports.getANetworkByNetworkNameController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const NetworkName = req.params.networkName;
    const result = yield networkServices.getNetworkByNetworkNameService(NetworkName);
    if (!result) {
        throw new Error("Network not found!");
    }
    else {
        res.send({
            success: true,
            data: result,
        });
    }
}));
// get Network by Id controller
exports.getANetworkByIdController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const NetworkId = new mongoose_1.Types.ObjectId(req.params.id);
    const result = yield networkServices.getNetworkByIdService(NetworkId);
    if (!result) {
        throw new Error("Network not found!");
    }
    else {
        res.send({
            success: true,
            data: result,
        });
    }
}));
// add new Network controller
exports.addNewNetworkController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { networkName } = req.body;
    const existNetwork = yield networkServices.getNetworkByNetworkNameService(networkName);
    if (!networkName) {
        throw new Error("Please enter required information: networkName!");
    }
    else if ((existNetwork === null || existNetwork === void 0 ? void 0 : existNetwork.networkName) === networkName) {
        throw new Error("Network already exist!");
    }
    else {
        const postBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
        const result = yield networkServices.addNewNetworkService(Object.assign(Object.assign({}, req.body), { postBy: Object.assign(Object.assign({}, postBy === null || postBy === void 0 ? void 0 : postBy.toObject()), { moreAboutUser: postBy === null || postBy === void 0 ? void 0 : postBy._id }) }));
        res.send({
            success: true,
            data: result,
        });
        console.log(`Network ${result._id} is added!`);
    }
}));
// get all Networks
exports.getAllNetworksController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield networkServices.getAllNetworks(req.query, true);
    res.send(Object.assign({ success: true }, result));
    console.log(`${(_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length} Networks are responsed!`);
}));
// update a network controller
exports.updateANetworkController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { networkName, networkPhotoURL } = req.body;
    const networkId = new mongoose_1.Types.ObjectId(req.params.id);
    const existNetwork = yield networkServices.getNetworkByIdService(networkId);
    if (!existNetwork) {
        throw new Error("Network doesn't exist!");
    }
    else {
        const updateBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // update the network
            const result = yield networkServices.updateANetworkService(networkId, Object.assign(Object.assign({}, req.body), { existNetwork, updateBy: Object.assign(Object.assign({}, updateBy === null || updateBy === void 0 ? void 0 : updateBy.toObject()), { moreAboutUser: updateBy === null || updateBy === void 0 ? void 0 : updateBy._id }) }), session);
            // update all posts that uses refference of the network
            if (networkName) {
                yield networkServices.updateRefferencePosts(networkId, result, session);
            }
            res.send({
                success: true,
                data: result,
            });
            console.log(`network is updated!`);
            yield session.commitTransaction();
        }
        catch (error) {
            session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
}));
// Delete a Network controller
exports.deleteANetworkController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const NetworkId = new mongoose_1.Types.ObjectId(req.params.id);
    const existNetwork = yield networkServices.getNetworkByIdService(NetworkId);
    const isRelatedPostExist = yield (0, post_services_1.getPostByNetworkIdService)(NetworkId);
    if (!existNetwork) {
        throw new Error("Network doesn't exist!");
    }
    else if (isRelatedPostExist.length) {
        throw new Error("Sorry! This Network has some posts, You can't delete the Network!");
    }
    else {
        const result = yield networkServices.deleteANetworkService(NetworkId);
        res.send({
            success: true,
            data: result,
        });
        console.log(`Network ${result} is added!`);
    }
}));
