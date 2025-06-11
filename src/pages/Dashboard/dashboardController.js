import { getDashboardData } from './dashboardService';

export const fetchDashboardData = async () => {
  try {
    // const data = await getDashboardData();
    const data = [
      { "id": 1, "nama": "Andi", "role": "Admin" },
      { "id": 2, "nama": "Budi", "role": "User" },
      { "id": 3, "nama": "Citra", "role": "Moderator" }
    ]

    return data;
  } catch (error) {
    console.error('Gagal memuat data dashboard:', error);
    return [];
  }
};
