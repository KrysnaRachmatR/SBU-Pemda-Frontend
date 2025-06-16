import api from '../../services/api';

export const getSertifikatData = async () => {
  try {
    const response = await api.get(`/diagram-status-anggota`);
    return response.data;
  } catch (error) {
    console.error('Error getSertifikatData:', error);
    return { success: false };
  }
};

export const getAnggotaStatus = async () => {
  try {
    const response = await api.get('/anggota');
    return response.data;
  }catch (error){
    console.error('Error getAnggotaStatus:', error);
    return { success: false };
  }
}

export const putPeriode = async (anggota_id, data) => { 
  try {
    const response = await api.put(`/anggota/${anggota_id}/update-sub-tanggal`, data);
    return response.data;
  } catch (error) {
    console.error('Error putPeriode:', error);
    return { success: false };
  }
};

export const fetchAnggotaSubKlasifikasi = async (anggota_id) => {
  try {
    const response = await api.get(`/anggota/${anggota_id}/sub-klasifikasi`);
    return response.data;
  } catch (error) {
    console.error('Error fetchAnggotaSubKlasifikasi:', error);
    return { success: false };
  }
};

export const fetchAnggotaList = async () => {
  try {
    const res = await api.get('/anggota');
    return res.data.data || [];
  } catch (error) {
    console.error('Gagal ambil anggota:', error);
    return [];
  }
};
