"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search_filter_and_queries = void 0;
const add_filters_operator_1 = require("./add_filters_operator");
const constants_1 = require("./constants");
const pick_1 = require("./pick");
const search_filter_and_queries = (modelName, query, ...fields) => {
    const filters = [];
    const _a = (0, pick_1.pick)(query, [
        "searchTerm",
        ...fields,
    ]), { searchTerm } = _a, filterFields = __rest(_a, ["searchTerm"]);
    // search term==========
    if (searchTerm) {
        const searchableFields = fields.filter((field) => {
            if (!constants_1.exclude_fields.includes(field)) {
                return field;
            }
        });
        filters.push({
            $or: searchableFields.map((field) => {
                if (modelName === "post" && field === "storeName") {
                    return { "store.storeName": { $regex: searchTerm, $options: "i" } };
                }
                else {
                    return {
                        [field]: { $regex: searchTerm, $options: "i" },
                    };
                }
            }),
        });
    }
    // filtering==========
    if (Object.keys(filterFields).length) {
        filters.push({
            $and: Object.entries(filterFields).map(([field, value]) => {
                if (!constants_1.exclude_fields.includes(field)) {
                    if (modelName === "post" && field === "storeName") {
                        return { "store.storeName": value };
                        // return { "store.storeName": { $regex: value, $options: "i" } };
                    }
                    else {
                        return {
                            [field]: { $regex: value, $options: "i" },
                        };
                    }
                }
                else {
                    let valueWithOperator = (0, add_filters_operator_1.addFiltersSymbolToOperators)(value);
                    if (field === "expireDate" || field === "createdAt") {
                        valueWithOperator = {
                            [Object.keys(valueWithOperator)[0]]: new Date(Object.values(valueWithOperator)[0]),
                        };
                    }
                    return {
                        [field]: valueWithOperator,
                    };
                }
            }),
        });
    }
    // queries
    const queryFields = ["sortBy", "sortOrder", "page", "limit"];
    let { sortBy, sortOrder, page, limit } = (0, pick_1.pick)(query, queryFields);
    if (!sortBy) {
        sortBy = "createdAt";
    }
    if (!sortOrder) {
        sortOrder = -1;
    }
    else if (sortOrder === "1" || sortOrder === "-1") {
        sortOrder = Number(sortOrder);
    }
    if (!page) {
        page = 1;
    }
    if (!limit) {
        limit = 10;
    }
    const skip = (page - 1) * limit;
    // push empty object to avoid error in aggregation
    if (!filters.length) {
        filters.push({});
    }
    return {
        filters: { $and: filters },
        limit: Number(limit),
        page: Number(page),
        skip,
        sortBy,
        sortOrder,
    };
};
exports.search_filter_and_queries = search_filter_and_queries;
