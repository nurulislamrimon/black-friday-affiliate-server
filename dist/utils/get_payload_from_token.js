"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayloadFromToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getPayloadFromToken = (token, secret_key = process.env.secret_key) => {
    const secret = secret_key || "";
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.getPayloadFromToken = getPayloadFromToken;
