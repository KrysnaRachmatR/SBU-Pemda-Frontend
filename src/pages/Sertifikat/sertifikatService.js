import axios from 'axios';
import { API_URL } from '../../utils/constant';

const getToken = () => localStorage.getItem('token');

// ✅ Ambil data anggota (tabel)
export const getSertifikatData = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/anggota`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error getSertifikatData:', error);
    return [];
  }
};

// ✅ Ambil data diagram anggota per sub klasifikasi (untuk chart)
export const getAnggotaPerKlasifikasi = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/diagram-subklasifikasi-anggota`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error getAnggotaPerKlasifikasi:', error);
    return [];
  }
};

// ✅ Simpan data anggota baru
export const postAnggota = async (data) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/add-anggota`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Gagal menyimpan anggota:', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Ambil daftar klasifikasi
export const getKlasifikasi = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/klasifikasi`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Gagal mengambil klasifikasi:', error);
    return [];
  }
};

// ✅ Ambil daftar tahun sub klasifikasi berdasarkan klasifikasi_id
export const getTahunSubKlasifikasi = async (klasifikasi_id) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/sub-klasifikasi/tahun/${klasifikasi_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    console.log('Response tahun sub klasifikasi:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Gagal mengambil tahun sub klasifikasi:', error);
    return [];
  }
};

// ✅ Ambil daftar sub klasifikasi (filter: klasifikasi_id & tahun)
export const getSubKlasifikasi = async (klasifikasi_id, tahun) => {
  try {
    console.log('Fetching sub klasifikasi with:', { klasifikasi_id, tahun });
    const token = getToken();
    const response = await axios.get(`${API_URL}/sub-klasifikasi/${tahun}/${klasifikasi_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    console.log('Response sub klasifikasi:', response);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Gagal mengambil sub klasifikasi:', error);
    return [];
  }
};

// ✅ Ambil daftar kota/kabupaten
export const getKotaKabupaten = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/kota-kabupaten`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Gagal mengambil data kota/kabupaten:', error);
    return [];
  }
};

// ✅ Ambil download sertifikat data sebagai file Excel
export const downloadSertifikatDataService = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/export/anggota/excel`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    responseType: 'blob',
  });

  return response.data; // hanya kembalikan blob-nya
};