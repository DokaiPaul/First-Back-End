"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
const db = {
    cars: [{ id: 1, title: 'Golf 5' },
        { id: 2, title: 'Opel Vectra A' },
        { id: 3, title: 'My new car' }]
};
exports.app.get('/', (req, res) => {
    res.send('This is the home page');
});
exports.app.get('/my-cars', (req, res) => {
    let foundCars = db.cars;
    if (req.query.title) {
        foundCars = foundCars.filter(u => u.title.indexOf(req.query.title) > -1);
    }
    res.status(200).json(foundCars);
});
exports.app.get('/my-cars/:id', (req, res) => {
    const cars = db.cars.find(i => i.id === +req.params.id);
    if (!cars) {
        res.sendStatus(404);
        return;
    }
    res.json(cars);
});
exports.app.post('/my-cars', (req, res) => {
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
exports.app.delete('/my-cars/:id', (req, res) => {
    db.cars = db.cars.filter(i => i.id !== +req.params.id);
    if ((db.cars.length - 1) <= +req.params.id) {
        res.sendStatus(204);
        return;
    }
    res.sendStatus(404);
});
exports.app.put('/my-cars/:id', (req, res) => {
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
exports.app.delete('/__test__/data', (req, res) => {
    db.cars = [];
    res.sendStatus(204);
});
