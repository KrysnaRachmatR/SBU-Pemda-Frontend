import api from '../../services/api';
import { getToken } from '../../utils/auth';

// ✅ Ambil data anggota (tabel)
export const getSertifikatData = async () => {
  try {
    const response = await api.get(`/anggota`);

    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error getSertifikatData:', error);
    return [];
  }
};

// ✅ Ambil data diagram anggota per sub klasifikasi (untuk chart)
export const getAnggotaPerKlasifikasi = async () => {
  try {
    const response = await api.get(`/diagram-subklasifikasi-anggota`);

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
    const response = await api.post(`/add-anggota`, data, {
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
    const response = await api.get(`/klasifikasi`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Gagal mengambil klasifikasi:', error);
    return [];
  }
};

// ✅ Ambil daftar tahun sub klasifikasi berdasarkan klasifikasi_id
export const getTahunSubKlasifikasi = async (klasifikasi_id) => {
  try {
    const response = await api.get(`/sub-klasifikasi/tahun/${klasifikasi_id}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Gagal mengambil tahun sub klasifikasi:', error);
    return [];
  }
};

// ✅ Ambil daftar sub klasifikasi (filter: klasifikasi_id & tahun)
export const getSubKlasifikasi = async (klasifikasi_id, tahun) => {
  try {
    const token = getToken();
    const response = await api.get(`/sub-klasifikasi/${tahun}/${klasifikasi_id}`);
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
    const response = await api.get(`/kota-kabupaten`);

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Gagal mengambil data kota/kabupaten:', error);
    return [];
  }
};

// ✅ Ambil download sertifikat data sebagai file Excel
export const downloadSertifikatDataService = async () => {
  const token = getToken();
  const response = await api.get(`/export/anggota/excel`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    responseType: 'blob',
  });

  return response.data; // hanya kembalikan blob-nya
};