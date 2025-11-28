import axios from 'axios';
import { LINK } from '../config/config';

export const request = {
  get: async (endpoint, config = {}) => {
    return await axios.get(`${LINK}/${endpoint}`, config);
  },
  post: async (endpoint, data, config = {}) => {
    return await axios.post(`${LINK}/${endpoint}`, data, config);
  },
  put: async (endpoint, data, config = {}) => {
    return await axios.put(`${LINK}/${endpoint}`, data, config);
  },
  delete: async (endpoint, config = {}) => {
    return await axios.delete(`${LINK}/${endpoint}`, config);
  }
};
