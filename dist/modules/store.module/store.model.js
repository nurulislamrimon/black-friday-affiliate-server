"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const mongoose_2 = require("mongoose");
const storeSchema = new mongoose_1.Schema({
    storeName: { type: String, required: true, unique: true, trim: true },
    storeLink: { type: String, required: true, validate: validator_1.default.isURL },
    storePhotoURL: { type: String, required: true, validate: validator_1.default.isURL },
    storeDescription: String,
    // storeCountries: [{ type: String, enum: countries }],
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
const Store = (0, mongoose_1.model)("Store", storeSchema);
exports.default = Store;
