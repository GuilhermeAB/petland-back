import { isEmpty } from 'lodash';
import Employee, { EmployeeType } from 'src/models/Employee';
import ValidationError from 'src/util/Error/validation-error';
import Appointment from '..';

/**
 * Get employees list
 *
 * @returns Employees list with employee appointments
 */
async function getEmployees (): Promise<EmployeeType[]> {
  const employees = await Employee.getList();
  if (!employees || isEmpty(employees)) {
    throw new ValidationError('EMPLOYEES_NOT_FOUND');
  }

  const appointments = employees.map((item) => Appointment
    .getById(item.id)
    .then((resolve) => {
      item.appointments = resolve;
    }));
  await Promise.all(appointments);

  return employees;
}

/**
 * Get schedule
 *
 * @param startsAt - Start time
 * @param finishesAt - Finish time
 * @param withLastTime - Include finishesAt
 * @returns array of strings with schedule. Example: ['08:30', '09:00', '09:30']
 */
function getSchedule (startsAt: string, finishesAt: string, withLastTime?: boolean): string[] {
  const startsAtSplitted = startsAt.split(':');
  const startsAtHour = parseInt(startsAtSplitted[0], 10);
  const startsAtMinute = parseInt(startsAtSplitted[1], 10);

  const finishesAtSplitted = finishesAt.split(':');
  const finishesAtHour = parseInt(finishesAtSplitted[0], 10);
  const finishesMinute = parseInt(finishesAtSplitted[1], 10);

  const schedule = [];
  for (let i = startsAtHour; i <= finishesAtHour; i += 1) {
    const hour = i < 10 ? `0${i}` : i;
    if (i === startsAtHour) {
      if (startsAtMinute === 0) {
        schedule.push(`${hour}:00`);
        if (startsAt !== finishesAt) {
          schedule.push(`${hour}:30`);
        }
      } else {
        schedule.push(`${hour}:30`);
      }
    } else if (i === finishesAtHour) {
      if (finishesMinute >= 30 || 0) {
        schedule.push(`${hour}:00`);
      }
    } else {
      schedule.push(`${hour}:00`);
      schedule.push(`${hour}:30`);
    }
  }

  if (withLastTime) {
    schedule.push(finishesAt);
  }

  return schedule;
}

/**
 * Get employee free time
 *
 * @param employee - Employee object
 * @returns array of strings with free time. Example: ['08:30', '09:00', '09:30']
 */
function getFreeTimeSchedule (employee: EmployeeType): string[] {
  let schedule = getSchedule(employee.startsAt, employee.finishesAt);
  const { appointments } = employee;
  if (appointments) {
    appointments.forEach((appointment) => {
      const finishesAtSplitted = appointment.finishesAt.split(':');
      const finishesAtHour = finishesAtSplitted[0];
      const finishesMinute = parseInt(finishesAtSplitted[1], 10);
      const appointmentFinishesAt = finishesMinute >= 0 && finishesMinute <= 30 ? `${finishesAtHour}:00` : `${finishesAtHour}:30`;

      const appointmentSchedule = getSchedule(appointment.startsAt, appointmentFinishesAt, finishesMinute !== 0);
      schedule = schedule.filter((item) => !appointmentSchedule.includes(item));
    });
  }

  return schedule;
}

/**
 * Get all available schedule
 *
 * @returns array of strings with all available schedules. Example: ['08:30', '09:00', '09:30']
 */
export default async function getAvailableTimes (): Promise<string[]> {
  const employees = await getEmployees();
  const schedule = employees.map((employee) => getFreeTimeSchedule(employee)).flat();
  const freeSchedule = [...new Set(schedule)].sort((a, b) => Date.parse(`1970/01/01 ${a}`) - Date.parse(`1970/01/01 ${b}`));

  return freeSchedule;
}
