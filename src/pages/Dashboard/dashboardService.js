import api from '../../services/api';
import { getToken } from '../../utils/auth';

export const getDashboardData = async () => {
  try {
    const response = await api.get('/klasifikasi');
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return [];
  }
}

export const postKlasifikasi = async (data) => {
  try {
    const token = getToken();
    const response = await api.post('/klasifikasi', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error saving klasifikasi:', error.response?.data || error.message);
    throw error;
  }
};