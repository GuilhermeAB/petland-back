import getAvailableTimes from './methods/get-available-times';
import getById from './methods/get-by-id';

export type AppointmentType = {
  employeeId: number,
  appointmentId: string,
  startsAt: string,
  finishesAt: string,
}

export default {
  getById: getById,
  getAvailableTimes: getAvailableTimes,
};
