import express, { Express, Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithQuery, RequestWithParamsAndBody } from '../types';
import { Request } from 'supertest';
import { GetQueryCarModel } from '../models/GetQueryCarModel';
import { CarsAPImodel } from '../models/CarApiModel';
import { CreateCarModel } from '../models/CreateCarModel';
import { UpdateCarModel } from '../models/UpdateCarModel';
import { GetURIcarModel } from '../models/GetURIcarModel';
import {CarsType, db, DBType} from '../db/db'


export const getCarsRouter = (db: DBType) => {
     const carsRouter = express.Router()
     carsRouter.get('/', (req: RequestWithQuery<GetQueryCarModel>, 
                          res: Response<CarsAPImodel[]>) => {
        let foundCars = db.cars;
     
        if (req.query.title) {
            foundCars = foundCars.filter(u => u.title.indexOf(req.query.title as string) > -1);
        }
     
        res.status(200).json(foundCars);
     })
     
     carsRouter.get('/:id', (req: RequestWithParams<GetURIcarModel>, 
                               res: Response<CarsAPImodel>) => {
        const cars = db.cars.find(i => i.id === +req.params.id);
     
        if(!cars) {
           res.sendStatus(404);
           return
        }
        
        res.json(cars);
     })
     
     carsRouter.post('/', (req: RequestWithBody<CreateCarModel>,
                           res: Response<CarsType>) => {
        if(!req.body.title) {
           res.sendStatus(400);
           return;
        }
        
        const addedCar = {
           id: Object.keys(db.cars).length + 1,
           title: req.body.title
        }
     
        db.cars.push(addedCar)
        res.status(201).json(addedCar);
     })
     
     carsRouter.delete(':id', (req: RequestWithParams<GetURIcarModel>, res) => {
        db.cars = db.cars.filter(i => i.id !== +req.params.id)
        if((db.cars.length - 1) <= +req.params.id) {
           res.sendStatus(204)
           return;
        }
        res.sendStatus(404)
     })
     
     carsRouter.put('/:id', (req: RequestWithParamsAndBody<GetURIcarModel,UpdateCarModel>, res) => {
        if(!req.body.title) {
           res.sendStatus(400);
           return;
        }
     
        const updatedCar = db.cars.find(i => i.id === +req.params.id)
        if(!updatedCar) {
           res.sendStatus(404);
           return;
        }
        updatedCar.title = req.body.title;
        res.sendStatus(204);
     })

     return carsRouter
}