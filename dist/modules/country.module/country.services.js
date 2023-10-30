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
exports.getAllCountrys = exports.getCountryByCountryNameService = void 0;
const country_model_1 = __importDefault(require("./country.model"));
//== get Country by name
const getCountryByCountryNameService = (CountryName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield country_model_1.default.findOne({ CountryName: CountryName });
    return result;
});
exports.getCountryByCountryNameService = getCountryByCountryNameService;
// get all Countrys
const getAllCountrys = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield country_model_1.default.aggregate([
        {
            $lookup: {
                from: "posts",
                foreignField: "Country",
                localField: "_id",
                as: "existPosts",
            },
        },
        {
            $addFields: { totalPosts: { $size: "$existPosts" } },
        },
        {
            $project: {
                existPosts: 0,
                postBy: 0,
                updateBy: 0,
                howToUse: 0,
            },
        },
    ]);
    return result;
});
exports.getAllCountrys = getAllCountrys;
