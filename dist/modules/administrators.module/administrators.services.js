"use strict";
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
exports.deleteAdministratorService = exports.updateAdministratorService = exports.getAdministratorsByIdService = exports.getAdministratorsByEmailService = exports.getMeAdminAndManagerService = exports.getAllAdminAndManagerService = exports.addNewAdministratorsService = void 0;
const administrators_model_1 = __importDefault(require("./administrators.model"));
const search_filter_and_queries_1 = require("../../utils/search_filter_and_queries");
const constants_1 = require("../../utils/constants");
//== create new Administrators
const addNewAdministratorsService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield administrators_model_1.default.create(payload);
    return result;
});
exports.addNewAdministratorsService = addNewAdministratorsService;
// get all admin and manager
const getAllAdminAndManagerService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { filters, skip, page, limit, sortBy, sortOrder } = (0, search_filter_and_queries_1.search_filter_and_queries)("user", query, ...constants_1.user_query_fields);
    const result = yield administrators_model_1.default.aggregate([
        {
            $lookup: {
                from: "users",
                foreignField: "email",
                localField: "email",
                as: "userInfo",
            },
        },
        {
            $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true },
        },
        {
            $project: {
                _id: 1,
                email: 1,
                role: 1,
                name: "$userInfo.name",
                country: "$userInfo.country",
                isVerified: "$userInfo.isVerified",
                photoURL: "$userInfo.photoURL",
                createdAt: 1,
            },
        },
        {
            $match: filters,
        },
        {
            $sort: {
                [sortBy]: sortOrder,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ]);
    const totalDocuments = yield administrators_model_1.default.countDocuments(filters);
    return {
        meta: {
            page,
            limit,
            totalDocuments,
        },
        data: result,
    };
});
exports.getAllAdminAndManagerService = getAllAdminAndManagerService;
// get me admin and manager
const getMeAdminAndManagerService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield administrators_model_1.default.aggregate([
        {
            $match: {
                email: email,
            },
        },
        {
            $lookup: {
                from: "users",
                foreignField: "email",
                localField: "email",
                as: "userInfo",
            },
        },
        {
            $unwind: "$userInfo",
        },
        {
            $project: {
                _id: 1,
                email: 1,
                role: 1,
                name: "$userInfo.name",
                country: "$userInfo.country",
                isVerified: "$userInfo.isVerified",
                photoURL: "$userInfo.photoURL",
                createdAt: 1,
            },
        },
    ]);
    return result ? result[0] : result;
});
exports.getMeAdminAndManagerService = getMeAdminAndManagerService;
//== get Administrators by email address used in authorization
const getAdministratorsByEmailService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield administrators_model_1.default.findOne({ email: email });
    return result;
});
exports.getAdministratorsByEmailService = getAdministratorsByEmailService;
//== get Administrators by id
const getAdministratorsByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield administrators_model_1.default.findOne({ _id: id });
    return result;
});
exports.getAdministratorsByIdService = getAdministratorsByIdService;
//== update an administrator
const updateAdministratorService = (targetedAdministratorId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield administrators_model_1.default.updateOne({ _id: targetedAdministratorId }, { $set: { role: role } }, { runValidators: true });
    return result;
});
exports.updateAdministratorService = updateAdministratorService;
//== delete an administrator
const deleteAdministratorService = (targetedAdministratorId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield administrators_model_1.default.findOneAndDelete({
        _id: targetedAdministratorId,
    });
    return result;
});
exports.deleteAdministratorService = deleteAdministratorService;
