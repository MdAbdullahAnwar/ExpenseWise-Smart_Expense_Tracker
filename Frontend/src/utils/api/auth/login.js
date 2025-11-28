import { StatusCodes } from 'http-status-codes';
import { headers } from '../../../config/config';
import { request } from '../../api';
import MESSAGE from '../../../constants/message';

const { post } = request;

export const loginUser = async (email, password) => {
  try {
    const payload = { email, password };
    const endpoint = 'user/login';
    const response = await post(endpoint, payload, headers);

    if (response) {
      const { data } = response;
      return data;
    }
    throw new Error(MESSAGE.error);
  } catch (error) {
    if (error.response?.status === StatusCodes.UNAUTHORIZED) {
      throw new Error('Invalid credentials');
    }
    throw error;
  }
};
