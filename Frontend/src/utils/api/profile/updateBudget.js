import { StatusCodes } from 'http-status-codes';
import { headers } from '../../../config/config';
import { request } from '../../api';
import { AUTHORIZATION } from '../../../constants/api/auth';
import MESSAGE from '../../../constants/message';

const { put } = request;
const { Authorization, Bearer } = AUTHORIZATION;

export const updateMonthlyBudget = async (monthlyBudget) => {
  try {
    const payload = ({ monthlyBudget });
    const endpoint = 'user/update-budget';
    const token = localStorage.getItem('token');
    const response = await put(endpoint, payload, {
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
