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
exports.updateCarouselByIdService = exports.addNewCarouselService = exports.getCarouselService = void 0;
const carousel_model_1 = __importDefault(require("./carousel.model"));
//== get a carousel
const getCarouselService = (project) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carousel_model_1.default.findOne({}, project);
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
const updateCarouselByIdService = (id, carousel) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield carousel_model_1.default.findByIdAndUpdate(id, { $set: carousel });
    return result;
    // return carousel;
});
exports.updateCarouselByIdService = updateCarouselByIdService;
