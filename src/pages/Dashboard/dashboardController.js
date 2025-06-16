import { getDashboardData, postKlasifikasi } from './dashboardService';

export const fetchDashboardData = async () => {
  try {
    const data = await getDashboardData();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return [];
  }
}

export const saveKlasifikasi = async (data) => {
  try {
    const response = await postKlasifikasi(data);
    return response;
  } catch (error) {
    console.error('Error saving klasifikasi:', error);
    throw error;
  }
};