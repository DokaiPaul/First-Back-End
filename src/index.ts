 import express from 'express'

 const app = express();
 const port = 3000;

 const db = {
   cars: [{id: 1, title: 'Golf 5'},
   {id: 2, title: 'Opel Vectra A'},
   {id: 3, title: 'My new car'}]
 }

 app.get('/my-cars/:id', (req, res) => {
   const cars = db.cars.find(i => i.id === +req.params.id);

   if(!cars) {
      res.sendStatus(404);
      return
   }
   
   res.json(cars);
})

app.get('/my-cars', (req, res) => {
   let foundCarsQuery = db.cars;

   if (req.query.title) {
       foundCarsQuery = foundCarsQuery.filter(u => u.title.indexOf(req.query.title as string) > -1);
   }

   res.json(foundCarsQuery);
})

 app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
 });