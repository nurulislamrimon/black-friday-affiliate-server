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
exports.updateActiveContactToInactiveService = exports.addNewContactService = exports.getContactService = void 0;
const Contact_model_1 = __importDefault(require("./Contact.model"));
//== get a Contact
const getContactService = (project) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Contact_model_1.default.findOne({ "contact.isActive": true }, project);
    return result;
});
exports.getContactService = getContactService;
//== create new Contact
const addNewContactService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Contact_model_1.default.create(payload);
    return result;
});
exports.addNewContactService = addNewContactService;
//== update Contact
const updateActiveContactToInactiveService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Contact_model_1.default.updateMany({ "contact.isActive": true }, {
        $set: { "contact.isActive": false },
    });
    return result;
});
exports.updateActiveContactToInactiveService = updateActiveContactToInactiveService;
