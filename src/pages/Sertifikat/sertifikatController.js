import {
  getSertifikatData,
  getAnggotaPerKlasifikasi,
  getKlasifikasi,
  getSubKlasifikasi,
  getTahunSubKlasifikasi,
  getKotaKabupaten,
  postAnggota,
} from './sertifikatService';

/**
 * Fetch semua data sertifikat dan format untuk tabel & chart
 */
export const fetchSertifikat = async (setChartData, setTableData) => {
  try {
    const raw = await getSertifikatData();

    const flattened = (raw || []).flatMap((anggota) =>
      (anggota.sub_klasifikasi || []).map((sub) => ({
        nama_perusahaan: anggota.nama_perusahaan,
        npwp: anggota.npwp,
        nib: anggota.nib,
        kota: anggota.kota_kabupaten,
        alamat: anggota.alamat,
        kode_sub_klasifikasi: sub.kode_sub_klasifikasi,
        subklasifikasi: sub.nama_sub_klasifikasi,
        kbli: (sub.kblis || []).map((k) => k.kode_kbli).join(', '),
        status: sub.status,
      }))
    );

    setTableData(flattened);

    const chartRaw = await getAnggotaPerKlasifikasi();
    const labels = chartRaw.map((item) => item.nama_sub_klasifikasi);
    const values = chartRaw.map((item) => item.jumlah_anggota);

    const backgroundColors = [
      '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b',
      '#858796', '#fd7e14', '#20c997', '#6610f2', '#6f42c1',
    ];

    const chartData = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors.slice(0, labels.length),
          hoverOffset: 10,
        },
      ],
    };

    setChartData(chartData);
  } catch (error) {
    console.error('Gagal memuat data sertifikat:', error);
    setTableData([]);
    setChartData({
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    });
  }
};

/**
 * Post data anggota baru ke server
 */
export const postAnggotaHandler = async (data) => {
  try {
    const response = await postAnggota(data);
    return response;
  } catch (error) {
    console.error('Gagal menyimpan anggota:', error);
    throw error;
  }
};

/**
 * Fetch kota/kabupaten untuk dropdown
 */
export const fetchKotaKabupaten = async (setKotaOptions) => {
  try {
    const data = await getKotaKabupaten();
    setKotaOptions(data);
  } catch (error) {
    console.error('Gagal mengambil kota/kabupaten:', error);
    setKotaOptions([]);
  }
};

/**
 * Fetch seluruh subklasifikasi
 */
export const fetchAllSubKlasifikasi = async (setSubKlasifikasiOptions) => {
  try {
    const data = await getSubKlasifikasi();
    setSubKlasifikasiOptions(data);
  } catch (error) {
    console.error('Gagal mengambil semua subklasifikasi:', error);
    setSubKlasifikasiOptions([]);
  }
};

/**
 * Fetch subklasifikasi berdasarkan filter klasifikasi dan tahun
 */
export const fetchSubKlasifikasiByFilter = async (
  klasifikasi_id,
  tahun,
  setFilteredOptions
) => {
  try {
    const data = await getSubKlasifikasi({ klasifikasi_id, tahun });
    setFilteredOptions(data);
  } catch (error) {
    console.error('Gagal mengambil subklasifikasi dengan filter:', error);
    setFilteredOptions([]);
  }
};

/**
 * Fetch seluruh klasifikasi untuk dropdown
 */
export const fetchKlasifikasi = async (setKlasifikasiOptions) => {
  try {
    const data = await getKlasifikasi();
    setKlasifikasiOptions(data);
  } catch (error) {
    console.error('Gagal mengambil klasifikasi:', error);
    setKlasifikasiOptions([]);
  }
};

/**
 * Fetch tahun subklasifikasi untuk dropdown
 */
export const fetchTahunSubKlasifikasi = async (setTahunOptions) => {
  try {
    const data = await getTahunSubKlasifikasi();
    setTahunOptions(data);
  } catch (error) {
    console.error('Gagal mengambil tahun subklasifikasi:', error);
    setTahunOptions([]);
  }
};
