"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarsRouter = void 0;
const express_1 = __importDefault(require("express"));
const getCarsRouter = (db) => {
    const carsRouter = express_1.default.Router();
    carsRouter.get('/', (req, res) => {
        let foundCars = db.cars;
        if (req.query.title) {
            foundCars = foundCars.filter(u => u.title.indexOf(req.query.title) > -1);
        }
        res.status(200).json(foundCars);
    });
    carsRouter.get('/:id', (req, res) => {
        const cars = db.cars.find(i => i.id === +req.params.id);
        if (!cars) {
            res.sendStatus(404);
            return;
        }
        res.json(cars);
    });
    carsRouter.post('/', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(400);
            return;
        }
        const addedCar = {
            id: Object.keys(db.cars).length + 1,
            title: req.body.title
        };
        db.cars.push(addedCar);
        res.status(201).json(addedCar);
    });
    carsRouter.delete(':id', (req, res) => {
        db.cars = db.cars.filter(i => i.id !== +req.params.id);
        if ((db.cars.length - 1) <= +req.params.id) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404);
    });
    carsRouter.put('/:id', (req, res) => {
        if (!req.body.title) {
            res.sendStatus(400);
            return;
        }
        const updatedCar = db.cars.find(i => i.id === +req.params.id);
        if (!updatedCar) {
            res.sendStatus(404);
            return;
        }
        updatedCar.title = req.body.title;
        res.sendStatus(204);
    });
    return carsRouter;
};
exports.getCarsRouter = getCarsRouter;
