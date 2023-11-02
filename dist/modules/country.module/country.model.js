"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const countrySchema = new mongoose_1.Schema({
  countryName: String,
  countryPhotoURL: String,
  shortForm: String,
});
const Country = (0, mongoose_1.model)("Country", countrySchema);
exports.default = Country;
