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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsExistAndAddFields = void 0;
const checkIsExistAndAddFields = (dbName, fieldName, fn, existPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const key = Object.keys(fieldName)[0];
    const value = fieldName[key];
    if (value) {
        const isExist = yield fn(value);
        if (!isExist) {
            throw new Error(`Invalid ${key} name ${value}!`);
        }
        else {
            const photoURL = `${dbName}PhotoURL`;
            const moreAbout = `moreAbout${dbName
                .slice(0, 1)
                .toLocaleUpperCase()
                .concat(dbName.slice(1))}`;
            existPayload[dbName] = {
                [key]: value,
                [photoURL]: isExist[photoURL],
                [moreAbout]: isExist._id,
            };
        }
    }
});
exports.checkIsExistAndAddFields = checkIsExistAndAddFields;
