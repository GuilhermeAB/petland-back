import axios from 'axios';
import ValidationError from 'src/util/Error/validation-error';
import { EmployeeType } from '..';

export default async function getList (): Promise<EmployeeType[] | undefined> {
  const {
    REQUEST_BASE_URL,
  } = process.env;

  if (!REQUEST_BASE_URL) {
    throw new ValidationError('INTERNAL_ERROR_INVALID_ENV');
  }

  const { data } = await axios({
    baseURL: REQUEST_BASE_URL,
    url: '/employees',
    method: 'GET',
    responseType: 'json',
  });

  return data.employees;
}
