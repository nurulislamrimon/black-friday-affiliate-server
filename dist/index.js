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
// external imports
const colors_1 = __importDefault(require("@colors/colors"));
// internal imports============
const app_1 = __importDefault(require("./app"));
const dbconnection_1 = __importDefault(require("./utils/dbconnection"));
function server() {
    return __awaiter(this, void 0, void 0, function* () {
        // database connection======
        (0, dbconnection_1.default)();
        // app listener
        app_1.default.listen(process.env.port, () => {
            console.log(colors_1.default.magenta(`Example app listening on port ${process.env.port}`.magenta));
        });
    });
}
server().catch((e) => console.log("Error:::::::", e));
