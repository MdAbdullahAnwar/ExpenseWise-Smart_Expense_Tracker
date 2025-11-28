import { StatusCodes } from 'http-status-codes';
import { headers } from '../../../config/config';
import { request } from '../../api';
import { AUTHORIZATION } from '../../../constants/api/auth';
import MESSAGE from '../../../constants/message';

const { delete: del } = request;
const { Authorization, Bearer } = AUTHORIZATION;

export const deleteBankAccount = async (id) => {
  try {
    const endpoint = `bankaccount/delete/${id}`;
    const token = localStorage.getItem('token');
    const response = await del(endpoint, {
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
