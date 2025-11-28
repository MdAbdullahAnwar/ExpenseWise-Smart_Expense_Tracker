import { headers } from '../../../config/config';
import { request } from '../../api';
import MESSAGE from '../../../constants/message';

const { post } = request;

export const resetPassword = async (id, password) => {
  try {
    const payload = { password };
    const endpoint = `password/resetpassword/${id}`;
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
