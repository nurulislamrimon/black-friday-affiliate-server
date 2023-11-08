"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const mongoose_2 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
    brandName: { type: String, required: true, unique: true, trim: true },
    brandPhotoURL: { type: String, validate: validator_1.default.isURL, required: true },
    brandLink: { type: String },
    brandDescription: String,
    // brandCountries: [{ type: String, enum: countries }],
    howToUse: [
        [
            {
                id: { type: String, required: true },
                type: { type: String, required: true },
                photoURL: { type: String, validate: validator_1.default.isURL },
                content: String,
            },
        ],
    ],
    postBy: {
        name: { type: String, required: true },
        email: { type: String, required: true, validate: validator_1.default.isEmail },
        moreAboutUser: {
            type: mongoose_2.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    updateBy: [
        {
            name: String,
            email: { type: String, validate: validator_1.default.isEmail },
            moreAboutUser: {
                type: mongoose_2.Types.ObjectId,
                ref: "User",
            },
        },
    ],
}, { timestamps: true });
const Brand = (0, mongoose_1.model)("Brand", brandSchema);
exports.default = Brand;
