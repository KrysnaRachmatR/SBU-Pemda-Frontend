import { getSertifikatData } from './periodeService';

export const fetchSertifikat = async (setChartData, setTableData) => {
  try {
    // const data = await getSertifikatData();

    const data = [
      {
        "nama" : "CV Gerak Jalan",
        "date" : "02-03-2023",
      },
      {
        "nama" : "CV Disini Aja",
        "date" : "01-03-2025",
      },
      {
        "nama" : "CV Kwan Kreatif",
        "date" : "10-11-2025",
      },
      {
        "nama" : "CV Krisna jawa",
        "date" : "02-12-2025",
      },
      {
        "nama" : "CV Gerak Maju",
        "date" : "02-08-2025",
      },
      {
        "nama" : "CV Maju Bersama",
        "date" : "09-10-2025",
      },
    ]

    const datas = [
      { "kategori": "SBU Aktif", "jumlah": 75 },
      { "kategori": "SBU Kadaluwarsa", "jumlah": 25 },
    ]

    // Format chart data
    const chartData = {
      labels: datas.map(item => item.kategori),
      datasets: [
        {
          label: 'Jumlah',
          data: datas.map(item => item.jumlah),
          backgroundColor: ['#9747ff', '#ffd8a3'],
        },
      ],
    };

    setChartData(chartData);
    setTableData(data);
  } catch (error) {
    console.error('Gagal ambil data sertifikat', error);
  }
};
