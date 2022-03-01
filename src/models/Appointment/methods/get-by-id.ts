import axios from 'axios';
import { isEmpty } from 'lodash';
import ValidationError from 'src/util/Error/validation-error';
import { AppointmentType } from '..';

export default async function getList (id: number): Promise<AppointmentType[] | undefined> {
  if (!id) {
    throw new ValidationError('ID_REQUIRED');
  }

  const {
    REQUEST_BASE_URL,
  } = process.env;

  if (!REQUEST_BASE_URL) {
    throw new ValidationError('INTERNAL_ERROR_INVALID_ENV');
  }

  const { data } = await axios({
    baseURL: REQUEST_BASE_URL,
    url: `/employee/${id}/appointments`,
    method: 'GET',
    responseType: 'json',
  });

  return !isEmpty(data.appointments) ? data.appointments : undefined;
}
