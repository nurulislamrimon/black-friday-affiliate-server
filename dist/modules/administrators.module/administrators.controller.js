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
exports.deleteAdministratorController = exports.updateAdministratorController = exports.getMeAdminAndManagerController = exports.getAllAdminAndManagerController = exports.addNewAdministratorController = void 0;
const administratorsServices = __importStar(require("./administrators.services"));
const mongoose_1 = require("mongoose");
const authorization_roles_1 = require("../../utils/constants/authorization_roles");
const catchAsync_1 = __importDefault(require("../../Shared/catchAsync"));
exports.addNewAdministratorController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const existAdministrator = yield administratorsServices.getAdministratorsByEmailService(email);
    if (existAdministrator) {
        throw new Error("Administrator already exist!");
    }
    const newAdministrator = yield administratorsServices.addNewAdministratorsService(req.body);
    res.send({
        success: true,
        data: newAdministrator,
    });
    console.log(`user ${newAdministrator._id} is responsed!`);
}));
// // get all admin and managers
exports.getAllAdminAndManagerController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield administratorsServices.getAllAdminAndManagerService(req.query);
    res.send(Object.assign({ success: true }, result));
    console.log(`Administrators ${(_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.length} are responsed!`);
}));
// // get all admin and managers
exports.getMeAdminAndManagerController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield administratorsServices.getMeAdminAndManagerService(req.body.decoded.email);
    res.send({
        success: true,
        data: result,
    });
    console.log(`Administrator is responsed!`);
}));
//update an administrator
exports.updateAdministratorController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const targetedAdministratorId = new mongoose_1.Types.ObjectId(req.params.id);
    const targetedAdministrator = (yield administratorsServices.getAdministratorsByIdService(targetedAdministratorId));
    const operatedAdministrator = (yield administratorsServices.getAdministratorsByEmailService(req.body.decoded.email));
    if (!targetedAdministrator) {
        throw new Error("Administrator not found!");
    }
    else if (operatedAdministrator.role !== authorization_roles_1.roles.SUPER_ADMIN &&
        targetedAdministrator.role === authorization_roles_1.roles.SUPER_ADMIN) {
        throw new Error("Unauthorized access!");
    }
    else {
        const result = yield administratorsServices.updateAdministratorService(targetedAdministratorId, req.body.role);
        res.send({
            success: true,
            data: result,
        });
        console.log(`Administrator is updated!`);
    }
}));
//update an administrator
exports.deleteAdministratorController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const targetedAdministratorId = new mongoose_1.Types.ObjectId(req.params.id);
    const targetedAdministrator = (yield administratorsServices.getAdministratorsByIdService(targetedAdministratorId));
    const operatedAdministrator = (yield administratorsServices.getAdministratorsByEmailService(req.body.decoded.email));
    const isMemberLoggedIn = yield administratorsServices.getMeAdminAndManagerService(targetedAdministrator.email);
    if (!targetedAdministrator) {
        throw new Error("Administrator not found!");
    }
    else if (isMemberLoggedIn) {
        throw new Error("Sorry User already logged once!");
    }
    else {
        const result = yield administratorsServices.deleteAdministratorService(targetedAdministratorId);
        res.send({
            success: true,
            data: result,
        });
        console.log(`Administrator is delete!`);
    }
}));
