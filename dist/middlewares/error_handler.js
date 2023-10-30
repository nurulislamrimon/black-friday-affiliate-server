"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.routeNotFound = void 0;
const error_codes_from_message_1 = require("../utils/error_codes_from_message");
const colors_1 = __importDefault(require("@colors/colors"));
const routeNotFound = (req, res, next) => {
    try {
        res.send({
            success: false,
            message: "Route doesn't exist!",
        });
        console.log(colors_1.default.red("Route doesn't exist!"));
    }
    catch (error) {
        next(error);
    }
};
exports.routeNotFound = routeNotFound;
const globalErrorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        throw new Error("Something went wrong!");
    }
    else {
        if (typeof err === "string") {
            res.status((0, error_codes_from_message_1.error_code_from_message)(err)).send({
                success: false,
                message: err,
                stack: process.env.NODE_ENV !== "development" ? "" : err,
            });
            console.log(colors_1.default.red(err));
        }
        else if (err) {
            res.status((0, error_codes_from_message_1.error_code_from_message)(err.message)).send({
                success: false,
                message: err.message,
                stack: process.env.NODE_ENV !== "development" ? "" : err === null || err === void 0 ? void 0 : err.stack,
            });
            console.log(colors_1.default.red(err.message));
        }
        else {
            res.send({
                success: false,
                message: "Internal server error!",
            });
            console.log(colors_1.default.red(err));
        }
    }
};
exports.globalErrorHandler = globalErrorHandler;
