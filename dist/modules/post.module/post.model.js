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
const validator_1 = __importDefault(require("validator"));
const countries_enum_1 = require("../../utils/constants/countries.enum");
const postSchema = new mongoose_1.Schema({
    postTitle: String,
    postPhotoURL: { type: String, validate: validator_1.default.isURL },
    productPreviewLink: { type: String, validate: validator_1.default.isURL },
    expireDate: { type: Date, validate: validator_1.default.isDate },
    postType: {
        type: String,
        enum: ["Coupon", "Deal", "Voucher"],
        default: "Coupon",
    },
    dealLink: { type: String, validate: validator_1.default.isURL },
    discountPercentage: Number,
    countries: [{ type: String, required: true, enum: countries_enum_1.countries }],
    couponCode: String,
    postDescription: String,
    isVerified: { type: Boolean, default: false },
    revealed: { type: Number, default: 0 },
    store: {
        type: mongoose_2.Types.ObjectId,
        required: true,
        ref: "Store",
    },
    brand: {
        type: mongoose_2.Types.ObjectId,
        ref: "Brand",
    },
    category: {
        type: mongoose_2.Types.ObjectId,
        ref: "Category",
    },
    campaign: {
        type: mongoose_2.Types.ObjectId,
        ref: "Campaign",
    },
    network: {
        type: mongoose_2.Types.ObjectId,
        ref: "Network",
    },
    postBy: {
        name: String,
        email: String,
        moreAboutUser: mongoose_2.Types.ObjectId,
    },
    updateBy: [
        {
            name: String,
            email: String,
            moreAboutUser: mongoose_2.Types.ObjectId,
        },
    ],
}, { timestamps: true });
postSchema.pre("validate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((this.postType === "Coupon" && !this.couponCode) ||
            (this.postType === "Coupon" && !this.network)) {
            throw new Error("Please provide a coupon code and Influencer Network!");
        }
        else if ((this.postType === "Voucher" && !this.dealLink) ||
            (this.postType === "Voucher" && !this.network)) {
            throw new Error("Please provide voucher link and Influencer Network!");
        }
        else if (this.postType === "Deal" && !this.dealLink) {
            throw new Error("Please provide deal link!");
        }
    });
});
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.default = Post;
