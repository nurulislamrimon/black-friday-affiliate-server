"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.routeNotFound = void 0;
const colors_1 = __importDefault(require("@colors/colors"));
const handleValidationError_1 = __importDefault(require("../Errors/handleValidationError"));
const castErrors_1 = __importDefault(require("../Errors/castErrors"));
const ApiError_1 = __importDefault(require("../Errors/ApiError"));
const mongoose_1 = __importDefault(require("mongoose"));
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
const globalErrorHandler = (error, req, res, next) => {
    process.env.env === "development" &&
        console.log(`🐱‍🏍 globalErrorHandler ~~`, { error });
    let statusCode = 500;
    let message = "Something went wrong !";
    let errorMessages = [];
    // if (error?.name === "ValidationError") {
    if (error instanceof mongoose_1.default.Error.ValidationError) {
        const simplifiedError = (0, handleValidationError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === "CastError") {
        const simplifiedError = (0, castErrors_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: "",
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: process.env.env !== "production" ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
