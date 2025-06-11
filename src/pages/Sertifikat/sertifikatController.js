import { getSertifikatData } from './sertifikatService';

export const fetchSertifikat = async (setChartData, setTableData) => {
  try {
    // const data = await getSertifikatData();

    const data = [
      {
        "KBLI" : "41011",
        "name" : "CV Kwan Kreatif",
        "NPWP" : "03.296.253.2-702.000",
        "NIB" : "8120016293314",
        "Kota" : "Malang",
        "Subklasifikasi" : "Teknologi",
        "address": "Dusun Sunsung, Kel. Saing Rambi, Kec. Sambas, Kab. Sambas, Prov. Kalimantan Barat"
      },
      {
        "KBLI" : "41011",
        "name" : "CV Kwan Kreatif",
        "NPWP" : "03.296.253.2-702.000",
        "NIB" : "8120016293314",
        "Kota" : "Malang",
        "Subklasifikasi" : "Teknologi",
        "address": "Dusun Sunsung, Kel. Saing Rambi, Kec. Sambas, Kab. Sambas, Prov. Kalimantan Barat"
      },
      {
        "KBLI" : "41011",
        "name" : "CV Kwan Kreatif",
        "NPWP" : "03.296.253.2-702.000",
        "NIB" : "8120016293314",
        "Kota" : "Malang",
        "Subklasifikasi" : "Teknologi",
        "address": "Dusun Sunsung, Kel. Saing Rambi, Kec. Sambas, Kab. Sambas, Prov. Kalimantan Barat"
      },
      {
        "KBLI" : "41011",
        "name" : "CV Kwan Kreatif",
        "NPWP" : "03.296.253.2-702.000",
        "NIB" : "8120016293314",
        "Kota" : "Malang",
        "Subklasifikasi" : "Teknologi",
        "address": "Dusun Sunsung, Kel. Saing Rambi, Kec. Sambas, Kab. Sambas, Prov. Kalimantan Barat"
      },
    ]

    const datas = [
      { "kategori": "Pelatihan", "jumlah": 20 },
      { "kategori": "Seminar", "jumlah": 15 },
      { "kategori": "Workshop", "jumlah": 10 },
      { "kategori": "Seminar", "jumlah": 15 },
      { "kategori": "Workshop", "jumlah": 10 },
      { "kategori": "Seminar", "jumlah": 15 },
      { "kategori": "Workshop", "jumlah": 10 },
    ]

    // Format chart data
    const chartData = {
      labels: datas.map(item => item.kategori),
      datasets: [
        {
          label: 'Jumlah',
          data: datas.map(item => item.jumlah),
          backgroundColor: ['#9747ff', '#fca997', '#b91293', '#c3e1ff', '#fb4e22', '#f3a8e2', '#ffd8a3'],
        },
      ],
    };

    setChartData(chartData);
    setTableData(data);
  } catch (error) {
    console.error('Gagal ambil data sertifikat', error);
  }
};
