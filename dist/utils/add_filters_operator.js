"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFiltersSymbolToOperators = void 0;
const addFiltersSymbolToOperators = (filters) => {
    let filtersString = JSON.stringify(filters);
    filtersString = filtersString.replace(/gt|gte|lt|lte/g, (match) => `$${match}`);
    return JSON.parse(filtersString);
};
exports.addFiltersSymbolToOperators = addFiltersSymbolToOperators;
