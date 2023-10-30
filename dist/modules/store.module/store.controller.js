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
exports.deleteAStoreController = exports.updateAStoreController = exports.getAllStoresController = exports.addNewStoreController = exports.getAllActiveStoresController = exports.getAStoreByStoreNameController = exports.getAStoreController = void 0;
const storeServices = __importStar(require("./store.services"));
const user_services_1 = require("../user.module/user.services");
const mongoose_1 = require("mongoose");
const post_services_1 = require("../post.module/post.services");
// get store by Id controller
const getAStoreController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeId = new mongoose_1.Types.ObjectId(req.params.id);
        const result = yield storeServices.getStoreByIdService(storeId);
        if (!result) {
            throw new Error("Store not found!");
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
exports.getAStoreController = getAStoreController;
// get store by Id controller
const getAStoreByStoreNameController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeName = req.params.storeName;
        const result = yield storeServices.getStoreByStoreNameService(storeName);
        if (!result) {
            throw new Error("Store not found!");
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
exports.getAStoreByStoreNameController = getAStoreByStoreNameController;
// get all active stores
const getAllActiveStoresController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield storeServices.getAllActiveStores(req.query);
        res.send(Object.assign({ success: true }, result));
        console.log(`${(_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length} stores are responsed!`);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllActiveStoresController = getAllActiveStoresController;
// add new store controller
const addNewStoreController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storeName, storePhotoURL, storeLink, countries } = req.body;
        const existStore = yield storeServices.getStoreByStoreNameService(storeName);
        if (!storeName || !storePhotoURL || !storeLink || !countries) {
            throw new Error("Please enter required information!");
        }
        else if ((existStore === null || existStore === void 0 ? void 0 : existStore.storeName) === storeName) {
            throw new Error("Store already exist!");
        }
        else {
            const postBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
            const result = yield storeServices.addNewStoreService(Object.assign(Object.assign({}, req.body), { postBy: Object.assign(Object.assign({}, postBy === null || postBy === void 0 ? void 0 : postBy.toObject()), { moreAboutUser: postBy === null || postBy === void 0 ? void 0 : postBy._id }) }));
            res.send({
                success: true,
                data: result,
            });
            console.log(`Store ${result._id} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addNewStoreController = addNewStoreController;
// get all stores
const getAllStoresController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const result = yield storeServices.getAllStores(req.query);
        res.send(Object.assign({ success: true }, result));
        console.log(`${(_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.length} stores are responsed!`);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllStoresController = getAllStoresController;
// update a store controller
const updateAStoreController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = new mongoose_1.Types.ObjectId(req.params.id);
        const existStore = yield storeServices.getStoreByIdService(postId);
        if (!existStore) {
            throw new Error("Store doesn't exist!");
        }
        else {
            const updateBy = yield (0, user_services_1.getUserByEmailService)(req.body.decoded.email);
            const result = yield storeServices.updateAStoreService(postId, Object.assign(Object.assign({}, req.body), { existStore, updateBy: Object.assign(Object.assign({}, updateBy === null || updateBy === void 0 ? void 0 : updateBy.toObject()), { moreAboutUser: updateBy === null || updateBy === void 0 ? void 0 : updateBy._id }) }));
            res.send({
                success: true,
                data: result,
            });
            console.log(`Store ${result} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateAStoreController = updateAStoreController;
// update a store controller
const deleteAStoreController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storeId = new mongoose_1.Types.ObjectId(req.params.id);
        const existStore = yield storeServices.getStoreByIdService(storeId);
        const isRelatedPostExist = yield (0, post_services_1.getPostByStoreIdService)(storeId);
        if (!existStore) {
            throw new Error("Store doesn't exist!");
        }
        else if (isRelatedPostExist.length) {
            throw new Error("Sorry! This store has some posts, You can't delete the store!");
        }
        else {
            const result = yield storeServices.deleteAStoreService(storeId);
            res.send({
                success: true,
                data: result,
            });
            console.log(`Store ${result} is added!`);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAStoreController = deleteAStoreController;
