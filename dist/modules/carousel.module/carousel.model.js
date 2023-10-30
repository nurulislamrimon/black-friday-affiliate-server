"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const carouselSchema = new mongoose_1.Schema({
    carousel: [
        {
            photoURL: { type: String, required: true, validate: validator_1.default.isURL },
            couponCode: String,
            externalLink: { type: String, validate: validator_1.default.isURL },
        },
    ],
    postBy: {
        name: String,
        email: String,
        moreAboutUser: { type: mongoose_2.Types.ObjectId, ref: "User" },
    },
    updateBy: [
        {
            name: String,
            email: String,
            moreAboutUser: { type: mongoose_2.Types.ObjectId, ref: "User" },
        },
    ],
}, { timestamps: true });
const Carousel = (0, mongoose_1.model)("Carousel", carouselSchema);
exports.default = Carousel;
