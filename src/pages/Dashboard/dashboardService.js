import api from '../../services/api';

export const getDashboardData = async () => {
  const res = await api.get('/dashboard'); // Ganti endpoint ini sesuai API-mu
  return res.data;
};
