import axios from 'axios';
import { API_URL } from '../../utils/constant';

export const loginService = async ({ username, password }) => {
  const res = await axios.post(`${API_URL}/login`, {
    username,
    password,
  });

  return res.data;
};
