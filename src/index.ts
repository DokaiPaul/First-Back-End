import express, { Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithQuery, RequestWithParamsAndBody } from './types';
import { Request } from 'supertest';
import { GetQueryCarModel } from './models/GetQueryCarModel';
import { CarsAPImodel } from './models/CarApiModel';
import { CreateCarModel } from './models/CreateCarModel';
import { UpdateCarModel } from './models/UpdateCarModel';
import { GetURIcarModel } from './models/GetURIcarModel';

 export const app = express();
 const port = 3000;
 
 const jsonBodyMiddleware = express.json();
 app.use(jsonBodyMiddleware)

type CarsType = {
   id: number
   title: string
}

 const db: {cars : CarsType[]} = {
   cars: [{id: 1, title: 'Golf 5'},
   {id: 2, title: 'Opel Vectra A'},
   {id: 3, title: 'My new car'}]
 }

app.get('/', (req, res) => {
   res.send('This is the home page')
})

app.get('/my-cars', (req: RequestWithQuery<GetQueryCarModel>, 
                     res: Response<CarsAPImodel[]>) => {
   let foundCars = db.cars;

   if (req.query.title) {
       foundCars = foundCars.filter(u => u.title.indexOf(req.query.title as string) > -1);
   }

   res.status(200).json(foundCars);
})

 app.get('/my-cars/:id', (req: RequestWithParams<GetURIcarModel>, 
                          res: Response<CarsAPImodel>) => {
   const cars = db.cars.find(i => i.id === +req.params.id);

   if(!cars) {
      res.sendStatus(404);
      return
   }
   
   res.json(cars);
})

app.post('/my-cars', (req: RequestWithBody<CreateCarModel>,
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

app.delete('/my-cars/:id', (req: RequestWithParams<GetURIcarModel>, res) => {
   db.cars = db.cars.filter(i => i.id !== +req.params.id)
   if((db.cars.length - 1) <= +req.params.id) {
      res.sendStatus(204)
      return;
   }
   res.sendStatus(404)
})

app.put('/my-cars/:id', (req: RequestWithParamsAndBody<GetURIcarModel,UpdateCarModel>, res) => {
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

app.delete('/__test__/data', (req, res) => {
   db.cars = [];
   res.sendStatus(204);
})

 app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
 });