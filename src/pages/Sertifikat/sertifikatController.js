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
 * Fetch all sertifikat data and format for table & chart
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
    console.error('Failed to load sertifikat data:', error);
    setTableData([]);
    setChartData({
      labels: [],
      datasets: [{ data: [], backgroundColor: [] }],
    });
  }
};

/**
 * Post new anggota data to the server
 */
export const postAnggotaHandler = async (data) => {
  try {
    const response = await postAnggota(data);
    return response;
  } catch (error) {
    console.error('Failed to save anggota:', error);
    throw error;
  }
};

/**
 * Fetch kota/kabupaten for dropdown
 */
export const fetchKotaKabupaten = async (setKotaOptions) => {
  try {
    const data = await getKotaKabupaten();
    setKotaOptions(data);
  } catch (error) {
    console.error('Failed to fetch kota/kabupaten:', error);
    setKotaOptions([]);
  }
};

/**
 * Fetch all subklasifikasi
 */
export const fetchAllSubKlasifikasi = async (setSubKlasifikasiOptions) => {
  try {
    const data = await getSubKlasifikasi();
    setSubKlasifikasiOptions(data);
  } catch (error) {
    console.error('Failed to fetch all subklasifikasi:', error);
    setSubKlasifikasiOptions([]);
  }
};

/**
 * Fetch klasifikasi options for dropdown
 */
export const fetchKlasifikasi = async (setOptions) => {
  try {
    const response = await getKlasifikasi();
    const mapped = response.map((item) => ({
      value: item.id,
      label: item.nama,
    }));
    setOptions(mapped);
  } catch (error) {
    console.error('Failed to fetch klasifikasi:', error);
  }
};

/**
 * Fetch subklasifikasi based on klasifikasi and year filter
 */
export const fetchSubKlasifikasiByFilter = async (klasifikasiId, tahun, setOptions) => {
  try {
    const response = await getSubKlasifikasi({ klasifikasi_id: klasifikasiId, tahun });
    const mapped = response.map((item) => ({
      value: item.id,
      label: item.nama,
    }));
    setOptions(mapped);
  } catch (error) {
    console.error('Failed to fetch sub klasifikasi:', error);
  }
};

/**
 * Fetch tahun subklasifikasi based on klasifikasi_id
 */
export const fetchTahunSubKlasifikasi = async (klasifikasi_id, setTahunOptions) => {
  try {
    const data = await getTahunSubKlasifikasi(klasifikasi_id);
    const mapped = data.map((tahun) => ({
      value: tahun,
      label: tahun,
    }));
    setTahunOptions(mapped);
  } catch (error) {
    console.error('Failed to fetch tahun sub klasifikasi:', error);
    setTahunOptions([]);
  }
};
