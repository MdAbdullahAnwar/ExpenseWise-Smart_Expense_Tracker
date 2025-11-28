import { headers } from '../../../config/config';
import { request } from '../../api';
import MESSAGE from '../../../constants/message';

const { post } = request;

export const forgotPassword = async (email) => {
  try {
    const payload = { email };
    const endpoint = 'password/forgotpassword';
    const response = await post(endpoint, payload, headers);

    if (response) {
      const { data } = response;
      return data;
    }
    throw new Error(MESSAGE.error);
  } catch (error) {
    throw error;
  }
};
