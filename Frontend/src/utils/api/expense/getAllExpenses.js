import { StatusCodes } from 'http-status-codes';
import { headers } from '../../../config/config';
import { request } from '../../api';
import { AUTHORIZATION } from '../../../constants/api/auth';
import MESSAGE from '../../../constants/message';

const { get } = request;
const { Authorization, Bearer } = AUTHORIZATION;

export const getAllExpenses = async (page = 1, limit = 10) => {
  try {
    const endpoint = `expense/getexpenses?page=${page}&limit=${limit}`;
    const token = localStorage.getItem('token');
    const response = await get(endpoint, {
      ...headers,
      [Authorization]: `${Bearer} ${token}`
    });

    if (response) {
      const { data } = response;
      return data;
    }
    throw new Error(MESSAGE.error);
  } catch (error) {
    if (error.response?.status === StatusCodes.UNAUTHORIZED) {
      alert('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};
