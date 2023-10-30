"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const administratorsSchema = new mongoose_1.Schema({
    email: { type: String, required: true, validate: validator_1.default.isEmail },
    role: {
        type: String,
        enum: {
            values: ["super-admin", "admin", "manager", "inactive"],
            message: `{VALUE} is not a valid role!`,
        },
        required: true,
    },
}, {
    timestamps: true,
});
const Administrators = (0, mongoose_1.model)("Administrators", administratorsSchema);
exports.default = Administrators;
