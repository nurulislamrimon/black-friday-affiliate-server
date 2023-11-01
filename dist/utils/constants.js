"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude_fields = exports.user_query_fields = exports.network_query_fields = exports.category_query_fields = exports.campaign_query_fields = exports.brand_query_fields = exports.store_query_fields = exports.post_query_fields = void 0;
exports.post_query_fields = [
    "_id",
    "postTitle",
    "storeName",
    "store._id",
    "brandName",
    "brand._id",
    "categoryName",
    "category._id",
    "campaignName",
    "campaign._id",
    "postType",
    "countries",
    "createdAt",
    "expireDate",
];
exports.store_query_fields = [
    "_id",
    "storeName",
    "postType",
    "countries",
    "createdAt",
];
exports.brand_query_fields = [
    "_id",
    "brandName",
    "postType",
    "countries",
    "createdAt",
];
exports.campaign_query_fields = [
    "_id",
    "campaignName",
    "postType",
    "countries",
    "createdAt",
];
exports.category_query_fields = ["_id", "categoryName"];
exports.network_query_fields = ["_id", "networkName"];
exports.user_query_fields = [
    "_id",
    "name",
    "email",
    "country",
    "isVerified",
    "role",
    "createdAt",
];
exports.exclude_fields = [
    "createdAt",
    "expireDate",
    "_id",
    "isVerified",
    "store._id",
    "brand._id",
    "category._id",
    "campaign._id",
];
