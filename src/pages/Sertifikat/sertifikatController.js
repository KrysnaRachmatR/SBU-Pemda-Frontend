import {
  getSertifikatData,
  getAnggotaPerKlasifikasi,
  getKlasifikasi,
  getSubKlasifikasi,
  getTahunSubKlasifikasi,
  getKotaKabupaten,
  postAnggota,
  downloadSertifikatDataService,
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
    '#E6FFE6', '#DFFFE2', '#D0F0C0', '#B2F2BB', '#A8E6A1', 
    '#90EE90', '#98FB98', '#80E5AA', '#77DD77', '#66DDAA', 
    '#4FC47F', '#3CB371', '#50C878', '#2ECC71', '#29AB87', 
    '#0BDA51', '#2E8B57', '#1C7C54', '#228B22', '#4F7942', 
    '#556B2F', '#3B5323', '#355E3B', '#006400', '#013220' 
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
    const response = await getSubKlasifikasi(klasifikasiId, tahun);
    const mapped = response.map((item) => ({
      value: item.id,
      label: item.nama,
    }));
    console.log('Mapped sub klasifikasi:', mapped);
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

/**
 * Fetch Download Sertifikat Data
 */
export const handleDownloadSertifikat = async () => {
  try {
    const blob = await downloadSertifikatDataService();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anggota.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Gagal mengunduh file Excel:', error);
    alert('Gagal mengunduh file Excel.');
  }
};