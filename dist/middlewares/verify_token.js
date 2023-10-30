"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify_token = void 0;
const user_services_1 = require("../modules/user.module/user.services");
const get_payload_from_token_1 = require("../utils/get_payload_from_token");
const verify_token = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new Error("Access Forbidden!");
        }
        else {
            const token = authorization.split(" ")[1];
            const payload = (0, get_payload_from_token_1.getPayloadFromToken)(token);
            const email = payload.email;
            const user = yield (0, user_services_1.getUserByEmailService)(email);
            if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
                throw new Error("Unauthorized access!");
            }
            else {
                req.body.decoded = payload;
                next();
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.verify_token = verify_token;
