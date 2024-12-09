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
exports.updateUserApiKey = exports.getUserByEmail = exports.createUser = void 0;
const UserModel_1 = __importDefault(require("./UserModel"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new UserModel_1.default(userData);
    yield user.save();
    console.log('User created:', user);
});
exports.createUser = createUser;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel_1.default.findOne({ email });
    console.log('User found:', user);
    return user;
});
exports.getUserByEmail = getUserByEmail;
const updateUserApiKey = (email, service, encryptedKey) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel_1.default.findOneAndUpdate({ email }, { $set: { [`apiKeys.${service}`]: encryptedKey } }, { new: true });
    console.log('Updated user:', user);
    return user;
});
exports.updateUserApiKey = updateUserApiKey;
