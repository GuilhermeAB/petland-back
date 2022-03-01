import { AppointmentType } from '../Appointment';
import getList from './methods/get-list';

export type EmployeeType = {
  id: number,
  name: string,
  startsAt: string,
  finishesAt: string,
  appointments?: AppointmentType[],
}

export default {
  getList: getList,
};
