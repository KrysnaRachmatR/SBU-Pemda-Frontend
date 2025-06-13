import { useEffect, useState } from 'react';
import {
  fetchSertifikat,
  postAnggotaHandler,
  fetchKotaKabupaten,
  fetchSubKlasifikasiByFilter,
  fetchKlasifikasi,
  fetchTahunSubKlasifikasi
} from './sertifikatController';

import { Modal, FloatingLabel, Form, Button, Pagination } from 'react-bootstrap';
import { useConfirm } from '../../components/ConfirmProvider';
import Select from 'react-select';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SertifikatView = () => {
  const { confirm } = useConfirm();

  const [tahunOptions, setTahunOptions] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState('');
  const [kotaOptions, setKotaOptions] = useState([]);
  const [klasifikasiOptions, setKlasifikasiOptions] = useState([]);
  const [filteredSubKlasifikasiOptions, setFilteredSubKlasifikasiOptions] = useState([]);
  const [selectedKlasifikasiId, setSelectedKlasifikasiId] = useState(null);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

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

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const currentData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    const ids = selectedOptions.map((option) => option.value);
    setFormData(prev => ({ ...prev, sub_klasifikasi_ids: ids }));
  };

  const subOptions = filteredSubKlasifikasiOptions.map((sub) => ({
    value: sub.id,
    label: sub.nama_sub_klasifikasi,
  }));

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
    setSelectedKlasifikasiId(null);
    setSelectedTahun('');
    setFilteredSubKlasifikasiOptions([]);
  };

  const handleSaveAdd = async () => {
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
        }
      },
      onNo: () => {},
    });
  };

  const handleSaveEdit = () => {
    confirm({
      message: 'Apakah kamu yakin ingin menyimpan perubahan?',
      onYes: () => handleCloseEdit(),
      onNo: () => {},
    });
  };

  const chartOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          const label = context.chart.data.labels[context.dataIndex];
          return `${value} (${percentage}%)`;
        },
        color: '#fff',
        font: { weight: 'bold', size: 14 },
      },
      legend: { position: 'bottom' },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    fetchSertifikat(setChartData, setTableData);
    fetchKotaKabupaten(setKotaOptions);
    fetchKlasifikasi(setKlasifikasiOptions);
    fetchTahunSubKlasifikasi(setTahunOptions);
  }, []);

  useEffect(() => {
    if (selectedKlasifikasiId && selectedTahun) {
      fetchSubKlasifikasiByFilter(
        selectedKlasifikasiId,
        selectedTahun,
        setFilteredSubKlasifikasiOptions
      );
    }
  }, [selectedKlasifikasiId, selectedTahun]);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      enabled: true,
    },
  },
};


  return (
    <>
      <div className="mb-4 w-100 d-flex justify-content-end align-items-center gap-3">
        <button className="btn tool-btn btn-sm btn-primary"><i className="bi bi-info-lg"></i></button>
        <button className="btn tool-btn btn-sm btn-outline-primary" onClick={handleShowEdit}><i className="bi bi-pencil"></i></button>
        <button className="btn tool-btn btn-sm btn-primary" onClick={handleShowAdd}>+</button>
      </div>

      <div className="row">
        <div className="col-12 col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-header text-center fw-bold">
              Diagram Anggota per Sub Klasifikasi
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div className="chart-wrapper w-100" style={{ height: '250px' }}>
                {chartData && chartData.datasets?.length ? (
                  <Doughnut data={chartData} options={options} />
                ) : (
                  <p className="text-center">Memuat grafik...</p>
                )}
              </div>
            </div>
          </div>
        </div>

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
                    {currentData.length ? currentData.map((item, index) => (
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
              <div className="d-flex justify-content-end mt-3">
                <Pagination>
                  <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Anggota */}
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

          <FloatingLabel label="Pilih Klasifikasi" className="mb-3">
            <Form.Select
              value={selectedKlasifikasiId || ''}
              onChange={(e) => setSelectedKlasifikasiId(parseInt(e.target.value))}
            >
              <option value="">-- Pilih --</option>
              {klasifikasiOptions.map((klas) => (
                <option key={klas.id} value={klas.id}>
                  {klas.nama}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel label="Pilih Tahun Sub Klasifikasi" className="mb-3">
            <Form.Select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(parseInt(e.target.value))}
            >
              <option value="">-- Pilih Tahun --</option>
              {tahunOptions.map((tahun) => (
                <option key={tahun} value={tahun}>
                  {tahun}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <div className="mb-3">
            <label className="form-label fw-bold">Pilih Sub Klasifikasi</label>
            <Select
              isMulti
              options={subOptions}
              onChange={handleMultiSelectChange}
              value={subOptions.filter(opt => formData.sub_klasifikasi_ids.includes(opt.value))}
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
        <Modal.Header closeButton>
          <Modal.Title>Edit Subklasifikasi</Modal.Title>
        </Modal.Header>
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