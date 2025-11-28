import { StatusCodes } from 'http-status-codes';
import { headers } from '../../../config/config';
import { request } from '../../api';
import MESSAGE from '../../../constants/message';

const { post } = request;

export const registerUser = async (name, email, password) => {
  try {
    const payload = { name, email, password };
    const endpoint = 'user/signup';
    const response = await post(endpoint, payload, headers);

    if (response) {
      const { data } = response;
      return data;
    }
    throw new Error(MESSAGE.error);
  } catch (error) {
    if (error.response?.status === StatusCodes.CONFLICT) {
      throw new Error('User already exists');
    }
    throw error;
  }
};
