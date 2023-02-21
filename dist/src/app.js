"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const cars_1 = require("./routes/cars");
const tests_1 = require("./routes/tests");
exports.app = (0, express_1.default)();
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use('/my-cars', (0, cars_1.getCarsRouter)(db_1.db));
exports.app.use('/__test__', (0, tests_1.getTestsRouter)(db_1.db));
