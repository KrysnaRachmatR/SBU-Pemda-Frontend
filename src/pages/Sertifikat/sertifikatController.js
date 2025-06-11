import { getSertifikatData } from './sertifikatService';

export const fetchSertifikat = async (setChartData, setTableData) => {
  try {
    const data = await getSertifikatData(); // data = response.data.data dari API

    // Format untuk table
    const tableData = data.map(item => ({
      KBLI: item.sub_klasifikasi.flatMap(sub => sub.kblis.map(kbli => kbli.kode_kbli)).join(', '),
      name: item.nama_perusahaan,
      NPWP: item.npwp,
      NIB: item.nib,
      Kota: item.kota_kabupaten,
      Subklasifikasi: item.sub_klasifikasi.map(sub => sub.nama_sub_klasifikasi).join(', '),
      address: item.alamat
    }));

    // Hitung jumlah perusahaan per kota untuk chart
    const kotaCount = {};
    data.forEach(item => {
      const kota = item.kota_kabupaten || 'Lainnya';
      kotaCount[kota] = (kotaCount[kota] || 0) + 1;
    });

    const chartData = {
      labels: Object.keys(kotaCount),
      datasets: [
        {
          label: 'Jumlah Perusahaan',
          data: Object.values(kotaCount),
          backgroundColor: '#0d6efd'
        }
      ]
    };

    // Set hasil ke state
    setTableData(tableData);
    setChartData(chartData);
    
  } catch (error) {
    console.error('Gagal ambil data sertifikat:', error);
  }
};
