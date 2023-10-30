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
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
// import bcrypt from "bcrypt";
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_2.Schema({
    photoURL: { type: String, validate: validator_1.default.isURL },
    name: { type: String, required: true },
    email: { type: String, required: true, validate: validator_1.default.isEmail },
    country: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    newPosts: [
        {
            moreAboutPost: { type: mongoose_1.Types.ObjectId, ref: "Post" },
            status: {
                type: String,
                enum: ["readed", "unreaded"],
                default: "unreaded",
            },
        },
    ],
    phoneNumber: String,
    // password: String,
    // confirmPassword: String,
    uid: String,
    favourite: {
        stores: [{ type: mongoose_1.Types.ObjectId, ref: "Store" }],
        posts: [{ type: mongoose_1.Types.ObjectId, ref: "Post" }],
    },
}, {
    timestamps: true,
});
userSchema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.uid) {
            this.isVerified = true;
            next();
        }
        // ===========for email password login=========
        // else if (this.password) {
        //   const isStrongPassword = /[a-zA-Z]/g.test(this.password);
        //   if (!isStrongPassword) {
        //     throw new Error("Please provide a strong password!");
        //   } else if (this.password === this.confirmPassword) {
        //     this.password = await bcrypt.hash(this.password, 10);
        //     this.confirmPassword = undefined;
        //     next();
        //   } else {
        //     throw new Error(
        //       "Please make sure password and confirm password are same!"
        //     );
        //   }
        // }
        else {
            throw new Error("UID not found!");
        }
    });
});
const User = (0, mongoose_2.model)("User", userSchema);
exports.default = User;
