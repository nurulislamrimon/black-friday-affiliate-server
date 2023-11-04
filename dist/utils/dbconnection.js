"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function dbconnection() {
    mongoose_1.default
        .connect(process.env.db_local || "")
        // .connect(process.env.db_remote || "")
        .then(() => console.log("Database connected!"))
        .catch((err) => {
        throw new Error(err);
    });
}
exports.default = dbconnection;
