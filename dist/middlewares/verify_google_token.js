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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const black_friday_affiliate_firebase_adminsdk_md5ie_8caae8c653_json_1 = __importDefault(require("../black-friday-affiliate-firebase-adminsdk-md5ie-8caae8c653.json"));
const verifyGoogleToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // for google  app initialize
    if (!firebase_admin_1.default.apps.length) {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(black_friday_affiliate_firebase_adminsdk_md5ie_8caae8c653_json_1.default),
        });
    }
    // check the token is valid and set the payload to the req.user
    try {
        const googleAccessToken = req.body.accessToken;
        if (!googleAccessToken) {
            throw new Error("Provide a valid access token!");
        }
        const payload = (yield firebase_admin_1.default
            .auth()
            .verifyIdToken(googleAccessToken));
        req.user = payload;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = verifyGoogleToken;
