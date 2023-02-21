import express, { Response } from 'express';
import { db } from './db/db';

import { getCarsRouter } from './routes/cars';
import { getTestsRouter } from './routes/tests';

export const app = express();
 
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)

app.use('/my-cars',getCarsRouter(db))
app.use('/__test__',getTestsRouter(db))