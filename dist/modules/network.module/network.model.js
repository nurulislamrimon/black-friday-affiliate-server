"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const mongoose_2 = require("mongoose");
const networkSchema = new mongoose_1.Schema({
    networkName: { type: String, required: true, unique: true, trim: true },
    // networkCountries: [{ type: String, enum: countries }],
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
const Network = (0, mongoose_1.model)("Network", networkSchema);
exports.default = Network;
