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
const store_services_1 = require("../store.module/store.services");
const network_services_1 = require("../network.module/network.services");
const category_services_1 = require("../category.module/category.services");
const brand_services_1 = require("../brand.module/brand.services");
const campaign_services_1 = require("../campaign.module/campaign.services");
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
        storeName: String,
        storePhotoURL: String,
        moreAboutStore: {
            type: mongoose_2.Types.ObjectId,
            required: true,
            ref: "Store",
        },
    },
    brand: {
        brandName: String,
        brandPhotoURL: String,
        moreAboutBrand: {
            type: mongoose_2.Types.ObjectId,
            ref: "Brand",
        },
    },
    category: {
        categoryName: String,
        moreAboutCategory: {
            type: mongoose_2.Types.ObjectId,
            ref: "Category",
        },
    },
    campaign: {
        campaignName: String,
        campaignPhotoURL: String,
        moreAboutCampaign: {
            type: mongoose_2.Types.ObjectId,
            ref: "Campaign",
        },
    },
    network: {
        networkName: String,
        moreAboutNetwork: {
            type: mongoose_2.Types.ObjectId,
            ref: "Network",
        },
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        // ================check store and set values======================
        if (!this.store.storeName) {
            throw new Error("Please provide a store name!");
        }
        else {
            const isStoreExist = yield (0, store_services_1.getStoreByStoreNameService)(this.store.storeName);
            if (!isStoreExist) {
                throw new Error("Please enter valid store name!");
            }
            else {
                this.store.moreAboutStore = isStoreExist._id;
                this.store.storePhotoURL = isStoreExist.storePhotoURL;
            }
        }
        // ================check brand and set values======================
        if ((_a = this.brand) === null || _a === void 0 ? void 0 : _a.brandName) {
            const isBrandExist = yield (0, brand_services_1.getBrandByBrandNameService)(this.brand.brandName);
            if (!isBrandExist) {
                throw new Error("Please enter a valid brandName!");
            }
            else {
                this.brand.moreAboutBrand = isBrandExist._id;
                this.brand.brandPhotoURL = isBrandExist.brandPhotoURL;
            }
        }
        // ================check category and set values===================
        if ((_b = this.category) === null || _b === void 0 ? void 0 : _b.categoryName) {
            const isCategoryExist = yield (0, category_services_1.getCategoryByCategoryNameService)(this.category.categoryName);
            if (!isCategoryExist) {
                throw new Error("Please enter a valid categoryName!");
            }
            else {
                this.category.moreAboutCategory = isCategoryExist._id;
            }
        }
        // ================check campaign and set values===================
        if ((_c = this.campaign) === null || _c === void 0 ? void 0 : _c.campaignName) {
            const isCampaignExist = yield (0, campaign_services_1.getCampaignByCampaignNameService)(this.campaign.campaignName);
            if (!isCampaignExist) {
                throw new Error("Please enter a valid campaignName!");
            }
            else {
                this.campaign.moreAboutCampaign = isCampaignExist._id;
                this.campaign.campaignPhotoURL = isCampaignExist.campaignPhotoURL;
            }
        }
        // ================validate others requirement===================
        // coupon validation-----------------
        if ((this.postType === "Coupon" && !this.couponCode) ||
            (this.postType === "Coupon" && !((_d = this.network) === null || _d === void 0 ? void 0 : _d.networkName))) {
            throw new Error("Please provide a coupon code and Influencer Network!");
        }
        else if (
        // voucher validation-----------------
        (this.postType === "Voucher" && !this.dealLink) ||
            (this.postType === "Voucher" && !((_e = this.network) === null || _e === void 0 ? void 0 : _e.networkName))) {
            throw new Error("Please provide dealLink and Influencer Network!");
        }
        else if (this.postType !== "Deal" && ((_f = this.network) === null || _f === void 0 ? void 0 : _f.networkName)) {
            const isNetworkExist = yield (0, network_services_1.getNetworkByNetworkNameService)((_g = this.network) === null || _g === void 0 ? void 0 : _g.networkName);
            if (!isNetworkExist) {
                throw new Error("Please enter a valid network name!");
            }
            else {
                this.network.moreAboutNetwork = isNetworkExist._id;
            }
        }
        else if (this.postType === "Deal") {
            // deal validation------------------
            if ((!this.postPhotoURL && !this.productPreviewLink) ||
                !this.dealLink ||
                !((_h = this.category) === null || _h === void 0 ? void 0 : _h.categoryName)) {
                throw new Error("Please provide dealLink, categoryName and postPhotoURL or productPreviewLink!");
            }
            else {
                if (!this.category.categoryName) {
                    throw new Error("Please enter a category name!");
                }
            }
        }
    });
});
const Post = (0, mongoose_1.model)("Post", postSchema);
exports.default = Post;
