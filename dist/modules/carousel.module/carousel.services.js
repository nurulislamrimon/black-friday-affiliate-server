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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCarouselService = exports.updateCarouselByIdService = exports.addNewCarouselService = exports.getCarouselService = exports.getCarouselByIdService = exports.getCarouselByCountryService = void 0;
const carousel_model_1 = __importDefault(require("./carousel.model"));
//== get a carousel by country
const getCarouselByCountryService = (countryName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carousel_model_1.default.findOne({ country: countryName }, "-postBy -updateBy");
    return result;
});
exports.getCarouselByCountryService = getCarouselByCountryService;
//== get a carousel by id
const getCarouselByIdService = (carouselId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carousel_model_1.default.findOne({ _id: carouselId });
    return result;
});
exports.getCarouselByIdService = getCarouselByIdService;
//== get all carousel
const getCarouselService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carousel_model_1.default.find({}, "-postBy -updateBy");
    return result;
});
exports.getCarouselService = getCarouselService;
//== create new carousel
const addNewCarouselService = (carousel) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carousel_model_1.default.create(carousel);
    return result;
});
exports.addNewCarouselService = addNewCarouselService;
//== update carousel
const updateCarouselByIdService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // add updator info
    let { updateBy, existCarousel } = payload, updateData = __rest(payload, ["updateBy", "existCarousel"]);
    updateBy = Object.assign(Object.assign({}, existCarousel.updateBy), updateBy);
    const result = yield carousel_model_1.default.updateOne({ _id: id }, { $set: updateData, $push: { updateBy: updateBy } }, { runValidators: true, upsert: true });
    return result;
});
exports.updateCarouselByIdService = updateCarouselByIdService;
//==delete a carousel
const deleteCarouselService = (carouselId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carousel_model_1.default.deleteOne({ _id: carouselId });
    return result;
});
exports.deleteCarouselService = deleteCarouselService;
