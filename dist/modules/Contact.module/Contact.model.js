"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    contact: {
        contactNo: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    postBy: {
        name: String,
        email: String,
        moreAboutUser: { type: mongoose_2.Types.ObjectId, ref: "User" },
    },
}, { timestamps: true });
const Contact = (0, mongoose_1.model)("Contact", contactSchema);
exports.default = Contact;
