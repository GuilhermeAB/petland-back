import { Request, Response } from 'express';
import Appointment from 'src/models/Appointment';

async function method (request: Request, response: Response): Promise<Response> {
  const list = await Appointment.getAvailableTimes();

  return response.success({
    list: list,
  });
}

export default {
  method: method,
};
