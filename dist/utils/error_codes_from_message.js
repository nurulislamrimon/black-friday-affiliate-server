"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_code_from_message = void 0;
const error_code_from_message = (message) => {
    if (message.toLowerCase().includes("unauthorized access")) {
        return 401;
    }
    else if (message.toLowerCase().includes("forbidden")) {
        return 403;
    }
    else {
        return 400;
    }
};
exports.error_code_from_message = error_code_from_message;
