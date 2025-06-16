import {
  getSertifikatData,
  getAnggotaStatus,
  putPeriode,
  fetchAnggotaSubKlasifikasi,
  fetchAnggotaList,
} from './periodeService';

// Fungsi untuk memformat tanggal ke format DD-MM-YYYY
const formatDMY = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
};

// Ambil data statistik untuk diagram status anggota (Aktif, Nonaktif, Pending)
export const fetchSertifikat = async (setChartData) => {
  try {
    const result = await getSertifikatData();
    if (result?.success && result?.data) {
      const { aktif, nonaktif, pending } = result.data;
      setChartData({
        labels: ['Aktif', 'Nonaktif', 'Pending'],
        datasets: [
          {
            data: [aktif, nonaktif, pending],
            backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
          },
        ],
      });
    } else {
      setChartData({});
    }
  } catch (error) {
    console.error('Gagal fetch data sertifikat:', error);
    setChartData({});
  }
};

// Ambil dan ubah data anggota menjadi data tabel berdasarkan sub klasifikasi
export const fetchAnggotaStatus = async (setTableData) => {
  try {
    const result = await getAnggotaStatus();
    if (result?.success && result?.data) {
      const data = result.data.flatMap((item) =>
        item.sub_klasifikasi.map((sub) => ({
          nama: item.nama_perusahaan,
          date: formatDMY(sub.masa_berlaku_sampai),
          tahun: sub.tahun,
          kbli: sub.kblis.map(k => k.kode_kbli).join(', '),
          klasifikasi: sub.nama_klasifikasi,
          subKlasifikasi: sub.nama_sub_klasifikasi,
        }))
      );
      setTableData(data);
    } else {
      setTableData([]);
    }
  } catch (error) {
    console.error('Gagal fetch data anggota:', error);
    setTableData([]);
  }
};

// Kirim data update periode ke backend
export const fetchPeriode = async (anggota_id, data, setShowAdd) => {
  try {
    const result = await putPeriode(anggota_id, data);
    if (result?.success) {
      setShowAdd(false);
      return { success: true };
    } else {
      console.error('Gagal update periode:', result?.message || 'Unknown error');
      return { success: false, message: result?.message || 'Gagal update periode' };
    }
  } catch (error) {
    console.error('Error fetchPeriode:', error);
    return { success: false, message: 'Terjadi kesalahan saat mengupdate periode' };
  }
};

// Ambil sub klasifikasi milik anggota berdasarkan ID
export const fetchAnggotaSubKlasifikasiList = async (anggota_id) => {
  try {
    const result = await fetchAnggotaSubKlasifikasi(anggota_id);
    if (result?.success && result?.data) {
      return result.data;
    } else {
      console.error('Gagal ambil sub klasifikasi:', result?.message || 'Unknown error');
      return [];
    }
  } catch (error) {
    console.error('Error fetchAnggotaSubKlasifikasiList:', error);
    return [];
  }
};

// Ambil semua anggota (dipakai di dropdown, dsb)
export const fetchAllAnggota = async () => {
  try {
    const result = await fetchAnggotaList(); // Panggil fungsi dari service
    return result; // Ini sudah berupa array
  } catch (error) {
    console.error('Error fetchAllAnggota:', error);
    return [];
  }
};

