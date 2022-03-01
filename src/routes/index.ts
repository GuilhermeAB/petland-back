import type { Request, Response } from 'express';
import { Router } from 'express';
import Appointment from 'src/controllers/Appointment';
import init from 'src/util/router';
import makeExpressCallback from './util/make-express-callback';

const routes = Router();

init(routes);

routes.get('/', (_request: Request, response: Response) => response.json({ message: 'Hello there' }));

routes.get(
  '/appointment/available-times',
  makeExpressCallback(Appointment.get.getAvailableTimes.method),
);

export default routes;
