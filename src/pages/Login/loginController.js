import { setToken } from '../../utils/auth';
import { loginService } from './loginService';

export const login = async (credentials) => {
  try {
    const response = await loginService(credentials);
    setToken(response.token);
    setToken("contoh-token-hahaha")
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
