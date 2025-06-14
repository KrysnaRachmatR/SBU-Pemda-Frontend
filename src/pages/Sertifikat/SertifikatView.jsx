import { useEffect, useState } from 'react';
import {
  fetchSertifikat,
  postAnggotaHandler,
  fetchKotaKabupaten,
  fetchSubKlasifikasiByFilter,
  fetchKlasifikasi,
  fetchTahunSubKlasifikasi
} from './sertifikatController';

import { Modal, FloatingLabel, Form, Button } from 'react-bootstrap';
import { useConfirm } from '../../components/ConfirmProvider';
import Select from 'react-select';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SertifikatView = () => {
  const { confirm } = useConfirm();

  // --- State ---
  const [tahunOptions, setTahunOptions] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState('');
  const [kotaOptions, setKotaOptions] = useState([]);
  const [klasifikasiOptions, setKlasifikasiOptions] = useState([]);
  const [filteredSubKlasifikasiOptions, setFilteredSubKlasifikasiOptions] = useState([]);
  const [selectedKlasifikasiId, setSelectedKlasifikasiId] = useState('');
  const [selectedSubKlasifikasiIds, setSelectedSubKlasifikasiIds] = useState([]);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    nama_perusahaan: '',
    nama_penanggung_jawab: '',
    email: '',
    no_telp: '',
    npwp: '',
    nib: '',
    alamat: '',
    tanggal_pendaftaran: '',
    kota_kabupaten_id: '',
    sub_klasifikasi_ids: [],
  });

  // --- Modal Handlers ---
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);
  const handleShowEdit = () => setShowEdit(true);
  const handleCloseEdit = () => setShowEdit(false);
  const [showEdit, setShowEdit] = useState(false);

  // --- Handler Form ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    const ids = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prev => ({ ...prev, sub_klasifikasi_ids: ids }));
    setSelectedSubKlasifikasiIds(ids); // Update selected sub klasifikasi ids
  };

  const handleKlasifikasiChange = async (e) => {
    const klasifikasiId = e.target.value;
    setSelectedKlasifikasiId(klasifikasiId);
    setFormData(prev => ({ ...prev, sub_klasifikasi_ids: [] }));
    setSelectedTahun('');
    setFilteredSubKlasifikasiOptions([]);

    if (klasifikasiId) {
      await fetchTahunSubKlasifikasi(klasifikasiId, setTahunOptions);
    } else {
      setTahunOptions([]);
    }
  };

  const handleTahunChange = async (e) => {
    const tahun = e.target.value;
    setSelectedTahun(tahun);
    setFormData(prev => ({ ...prev, sub_klasifikasi_ids: [] }));

    if (selectedKlasifikasiId && tahun) {
      await fetchSubKlasifikasiByFilter(selectedKlasifikasiId, tahun, setFilteredSubKlasifikasiOptions);
    } else {
      setFilteredSubKlasifikasiOptions([]);
    }
  };

  const resetForm = () => {
    setFormData({
      nama_perusahaan: '',
      nama_penanggung_jawab: '',
      email: '',
      no_telp: '',
      npwp: '',
      nib: '',
      alamat: '',
      tanggal_pendaftaran: '',
      kota_kabupaten_id: '',
      sub_klasifikasi_ids: [],
    });
    setSelectedKlasifikasiId('');
    setSelectedTahun('');
    setFilteredSubKlasifikasiOptions([]);
    setSelectedSubKlasifikasiIds([]);
  };

  // --- Submit Form ---
  const handleSaveAdd = async () => {
  if (formData.sub_klasifikasi_ids.length === 0) {
    alert('Please select at least one sub klasifikasi.');
    return;
  }
  confirm({
    message: 'Apakah kamu yakin ingin menyimpan data ini?',
    onYes: async () => {
      try {
        await postAnggotaHandler(formData);
        handleCloseAdd();
        resetForm();
        await fetchSertifikat(setChartData, setTableData);
      } catch (error) {
        console.error('Gagal menyimpan data:', error);
        alert(`Failed to save data: ${error.message || 'Server error'}`);
      }
    },
  });
};

  const handleSaveEdit = () => {
    confirm({
      message: 'Apakah kamu yakin ingin menyimpan perubahan?',
      onYes: () => {
        handleCloseEdit();
      },
    });
  };

  // --- Fetch Data on Mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSertifikat(setChartData, setTableData);
        await fetchKotaKabupaten(setKotaOptions);
        await fetchKlasifikasi(setKlasifikasiOptions);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchData();
  }, []);

  // --- Chart Options ---
  const chartOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: ${value} (${percentage}%)`;
        },
        color: '#fff',
        font: { weight: 'bold', size: 14 },
      },
      legend: { position: 'bottom' },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // --- Render ---
  return (
    <>
      <div className="mb-4 w-100 d-flex justify-content-end align-items-center gap-3">
        <button className="btn tool-btn btn-sm btn-primary"><i className="bi bi-info-lg"></i></button>
        <button className="btn tool-btn btn-sm btn-outline-primary" onClick={handleShowEdit}><i className="bi bi-pencil"></i></button>
        <button className="btn tool-btn btn-sm btn-primary" onClick={handleShowAdd}>+</button>
      </div>

      <div className="row">
        {/* Chart */}
        <div className="col-12 col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-header text-center fw-bold">Diagram Anggota per Sub Klasifikasi</div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div className="chart-wrapper w-100" style={{ height: '250px' }}>
                {chartData.datasets.length ? (
                  <Doughnut data={chartData} options={chartOptions} />
                ) : (
                  <p className="text-center">Memuat grafik...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="col-12 col-md-8">
          <div className="card">
            <div className="card-header text-center fw-bold">Data Sertifikat</div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-striped mb-0">
                  <thead className="table-dark text-center">
                    <tr>
                      <th>KBLI</th>
                      <th>Kode SBU</th>
                      <th>Nama Usaha</th>
                      <th>NPWP</th>
                      <th>NIB</th>
                      <th>Kabupaten/Kota</th>
                      <th>Subklasifikasi</th>
                      <th>Alamat</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.length ? tableData.slice(0, 5).map((item, index) => (
                      <tr key={index}>
                        <td>{item.kbli}</td>
                        <td>{item.kode_sub_klasifikasi}</td>
                        <td>{item.nama_perusahaan}</td>
                        <td>{item.npwp}</td>
                        <td>{item.nib}</td>
                        <td>{item.kota}</td>
                        <td>{item.subklasifikasi}</td>
                        <td style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{item.alamat}</td>
                        <td className="text-center">
                          <span className={`badge ${item.status === 'aktif' ? 'bg-success' : 'bg-danger'}`}>{item.status}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="9" className="text-center">Tidak ada data.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Anggota */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Anggota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel label="Nama Perusahaan" className="mb-3">
            <Form.Control name="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} />
          </FloatingLabel>
          <FloatingLabel label="Penanggung Jawab" className="mb-3">
            <Form.Control name="nama_penanggung_jawab" value={formData.nama_penanggung_jawab} onChange={handleChange} />
          </FloatingLabel>
          <FloatingLabel label="Email" className="mb-3">
            <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} />
          </FloatingLabel>
          <FloatingLabel label="No. Telp" className="mb-3">
            <Form.Control name="no_telp" value={formData.no_telp} onChange={handleChange} />
          </FloatingLabel>
          <FloatingLabel label="NPWP" className="mb-3">
            <Form.Control name="npwp" value={formData.npwp} onChange={handleChange} />
          </FloatingLabel>
          <FloatingLabel label="NIB" className="mb-3">
            <Form.Control name="nib" value={formData.nib} onChange={handleChange} />
          </FloatingLabel>
          <FloatingLabel label="Alamat" className="mb-3">
            <Form.Control name="alamat" value={formData.alamat} onChange={handleChange} />
          </FloatingLabel>
          <FloatingLabel label="Tanggal Pendaftaran" className="mb-3">
            <Form.Control name="tanggal_pendaftaran" type="date" value={formData.tanggal_pendaftaran} onChange={handleChange} />
          </FloatingLabel>

          {/* Kota/Kabupaten */}
          <FloatingLabel label="Pilih Kota/Kabupaten" className="mb-3">
            <Form.Select
              name="kota_kabupaten_id"
              value={formData.kota_kabupaten_id}
              onChange={handleChange}
            >
              <option value="">-- Pilih --</option>
              {kotaOptions.map((kota) => (
                <option key={kota.id} value={kota.id}>
                  {kota.nama}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          {/* Klasifikasi */}
          <FloatingLabel label="Pilih Klasifikasi" className="mb-3">
            <Form.Select value={selectedKlasifikasiId} onChange={handleKlasifikasiChange}>
              <option value="">-- Pilih Klasifikasi --</option>
              {klasifikasiOptions.map((klas) => (
                <option key={klas.value} value={klas.value}>
                  {klas.label}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          {/* Tahun Sub Klasifikasi */}
          <FloatingLabel label="Pilih Tahun Sub Klasifikasi" className="mb-3">
            <Form.Select
              value={selectedTahun}
              onChange={handleTahunChange}
              disabled={!selectedKlasifikasiId}
            >
              <option value="">-- Pilih Tahun --</option>
              {tahunOptions.map((tahun) => (
                <option key={tahun.value} value={tahun.value}>
                  {tahun.label}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          {/* Sub Klasifikasi */}
          <div className="mb-3">
            <label className="form-label fw-bold">Pilih Sub Klasifikasi</label>
            <Select
              isMulti
              options={filteredSubKlasifikasiOptions}
              onChange={handleMultiSelectChange}
              value={filteredSubKlasifikasiOptions.filter((opt) =>
                formData.sub_klasifikasi_ids.includes(opt.value)
              )}
              isDisabled={filteredSubKlasifikasiOptions.length === 0}
              placeholder={
                selectedKlasifikasiId && selectedTahun
                  ? 'Pilih sub klasifikasi'
                  : 'Silakan pilih klasifikasi dan tahun dulu'
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSaveAdd}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Edit Placeholder */}
      <Modal show={showEdit} onHide={handleCloseEdit} centered size="lg">
        <Modal.Header closeButton><Modal.Title>Edit Subklasifikasi</Modal.Title></Modal.Header>
        <Modal.Body>
          <p>Form edit masih placeholder. Bisa dikembangkan sesuai kebutuhan.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>Tutup</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SertifikatView;
