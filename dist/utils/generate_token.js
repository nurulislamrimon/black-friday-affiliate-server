"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generate_token(data, expiresIn = "1d", secretKey = process.env.secret_key) {
    const { email } = data;
    const token = jsonwebtoken_1.default.sign({ email }, secretKey || "", {
        expiresIn,
    });
    return token;
}
exports.generate_token = generate_token;
