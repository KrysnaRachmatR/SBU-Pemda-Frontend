import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchSertifikat,
  postAnggotaHandler,
  fetchKotaKabupaten,
  fetchSubKlasifikasiByFilter,
  fetchKlasifikasi,
  fetchTahunSubKlasifikasi,
  handleDownloadSertifikat,
} from './sertifikatController';

import { Dropdown, Badge, Modal, Col, FloatingLabel, Form, Button, Pagination, InputGroup, FormControl } from 'react-bootstrap';
import { useConfirm } from '../../components/ConfirmProvider';
import Select from 'react-select';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SertifikatView = () => {
  const navigate = useNavigate();
  const [filterParams] = useSearchParams();

  const { confirm } = useConfirm();

  // --- State ---
  const [tahunOptions, setTahunOptions] = useState([]);
  const [selectedTahun, setSelectedTahun] = useState('');
  const [kotaOptions, setKotaOptions] = useState([]);
  const [klasifikasiOptions, setKlasifikasiOptions] = useState([]);
  const [filteredSubKlasifikasiOptions, setFilteredSubKlasifikasiOptions] = useState([]);
  const [selectedKlasifikasiId, setSelectedKlasifikasiId] = useState('');
  const [selectedSubKlasifikasiIds, setSelectedSubKlasifikasiIds] = useState([]);
  
  const [chartData, setChartData] = useState({ labels: [], datasets: [], sbuCode: [], sbuClass: [] });
  const [tableData, setTableData] = useState([]);

  const [queryFilter, setQueryFilter] = useState(null);
  const [querySearch, setQuery] = useState('');

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Modal Handlers ---
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  // --- Handler Form ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    const ids = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prev => ({ ...prev, sub_klasifikasi_ids: ids }));
    setSelectedSubKlasifikasiIds(ids);
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

  const fetchDownloadSertifikat = async () => {
    try {
      await handleDownloadSertifikat();
    } catch (error) {
      alert('Gagal mengunduh file Excel.');
    }
  };

  // handle search table

  // if use serverside render
  // const handleSearch = async () => {
  //   await fetchSertifikat(setChartData, setTableData, querySearch);
  // };


  // --- Fetch Data on Mount ---
  useEffect(() => {
    setQueryFilter(filterParams.get('filter'));
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
          // return `${label}: ${value} (${percentage}%)`;
          return ``;
        },
        color: '#fff',
        font: { weight: 'bold', size: 14 },
      },
      legend: { position: 'bottom', display: false},
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const onSelectFilter = (value) => {
    if (value) {
      setQueryFilter(value);
      navigate(`/sbu?filter=${encodeURIComponent(value)}`);
    }
  }

  const clearFilter = () => {
    setQueryFilter(null);
    navigate('/sbu');
  };

  // client side search & filter
  const filteredData = queryFilter
  ? tableData.filter(item => item.nama_klasifikasi.toLowerCase() === queryFilter.toLowerCase())
  : tableData;

  const searchedData = filteredData.filter(item =>
    item.kode_sub_klasifikasi.toLowerCase().includes(querySearch.toLowerCase()) ||
    item.nama_perusahaan.toLowerCase().includes(querySearch.toLowerCase()) ||
    item.npwp.toLowerCase().includes(querySearch.toLowerCase()) ||
    item.nib.toLowerCase().includes(querySearch.toLowerCase())
  );
  const currentItems = searchedData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(searchedData.length / itemsPerPage);

  // --- Render ---
  return (
    <>
      <div className="mb-4 w-100 d-flex justify-content-end gap-3">
        {!queryFilter ? (
          <Dropdown>
            <Dropdown.Toggle variant="primary" size="sm" className="filter-btn-sm">
              <i className="bi bi-funnel"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {klasifikasiOptions.map((item, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => onSelectFilter(item.label)}
                >
                  {item.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Badge
            bg="primary"
            className="filter-badge"
            style={{ cursor: 'pointer'}}
            onClick={clearFilter}
          >
            {queryFilter} &nbsp;
            <i className="bi bi-x-circle-fill"></i>
          </Badge>
        )}
        <button className="btn tool-btn btn-sm btn-primary"><i className="bi bi-info-lg"></i></button>
        <button className="btn tool-btn btn-sm btn-outline-primary" onClick={handleShowEdit}><i className="bi bi-pencil"></i></button>
        <button className="btn tool-btn btn-sm btn-primary" onClick={handleShowAdd}>+</button>
        <button className="btn tool-btn btn-sm btn-primary" onClick={fetchDownloadSertifikat}><i className="bi bi-download"></i></button>
      </div>

      <div className="row">
        {/* Chart */}
       <div className="col-12 col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-header text-center fw-bold">
              Diagram Anggota per Sub Klasifikasi
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              <div className="chart-wrapper">
                {chartData.datasets.length ? (
                  <Doughnut data={chartData} options={chartOptions} />
                ) : (
                  <p className="text-center">Memuat grafik...</p>
                )}
              </div>
              <div className="mt-3">
              
                {/* legend */}
                {chartData?.labels?.map((label, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: chartData.datasets[0].backgroundColor[index] || "#000",
                        marginRight: '8px',
                        borderRadius: '4px',
                      }}
                    ></div>
                    <div style={{width:'calc(100% - 24px)'}}>
                      <span>{label}</span>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="col-12 col-md-8">
            <InputGroup className="p-3 border border-bottom-0 rounded-top">

                <FormControl
                  placeholder="Cari Nama Usaha / NPWP / NIB"
                  value={querySearch}
                  onChange={(e) => setQuery(e.target.value)}
                />

                {/* if use serverside render */}
                {/* <Button variant="primary" onClick={handleSearch}>
                  Cari
                </Button> */}

            </InputGroup>
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
                    {/* <th>Alamat</th> */}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length ? currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.kbli}</td>
                      <td>{item.kode_sub_klasifikasi}</td>
                      <td className="single-line">{item.nama_perusahaan}</td>
                      <td className="single-line">{item.npwp}</td>
                      <td>{item.nib}</td>
                      <td>{item.kota}</td>
                      <td><span className="truncate-2"> {item.subklasifikasi}</span></td>
                      {/* <td style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{item.alamat}</td> */}
                      {/* <td><span className="truncate-2"> {item.alamat}</span></td> */}
                      <td className="text-center" style={{verticalAlign:'middle'}}>
                        <span
                          className={`badge ${
                            item.status === 'aktif'
                              ? 'bg-success'
                              : item.status === 'pending'
                              ? 'bg-warning text-dark'
                              : 'bg-danger'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="9" className="text-center">Tidak ada data.</td></tr>
                  )}
                </tbody>
              </table>

              {/* pagination */}
              <div className="w-100 d-flex justify-content-end mt-3">
                <Pagination className='mb-0'>
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  />

                  {/* Tampilkan halaman pertama */}
                  <Pagination.Item
                    active={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    {1}
                  </Pagination.Item>
                  {/* Tampilkan halaman 2 dan 3 jika user sedang di halaman tengah */}
                  {currentPage > 3 && <Pagination.Ellipsis disabled />}
                  {[...Array(totalPages)].slice(1, -1).map((_, i) => {
                    const page = i + 2;
                    if (Math.abs(currentPage - page) <= 1) {
                      return (
                        <Pagination.Item
                          key={page}
                          active={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Pagination.Item>
                      );
                    }
                    return null;
                  })}
                  {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}

                  {/* Tampilkan halaman terakhir jika lebih dari 1 */}
                  {totalPages > 1 && (
                    <Pagination.Item
                      active={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Pagination.Item>
                  )}

                  <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  />
                </Pagination>
              </div>
            </div>
        </div>
      </div>

      {/* Modal Tambah Anggota */}
      <Modal show={showAdd} onHide={handleCloseAdd} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Anggota</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className='row'>
            <Col>
              <FloatingLabel label="Nama Perusahaan" className="mb-3">
                <Form.Control placeholder='-' name="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} required />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="Penanggung Jawab" className="mb-3">
                <Form.Control placeholder='-' name="nama_penanggung_jawab" value={formData.nama_penanggung_jawab} onChange={handleChange} />
              </FloatingLabel>
            </Col>
          </div>

          <div className='row'>
            <Col>
              <FloatingLabel label="Email" className="mb-3">
                <Form.Control placeholder='-' name="email" type="email" value={formData.email} onChange={handleChange} />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="No. Telp" className="mb-3">
                <Form.Control placeholder='-' name="no_telp" value={formData.no_telp} onChange={handleChange} />
              </FloatingLabel>
            </Col>
          </div>

          <div className='row'>
            <Col>
              <FloatingLabel label="NPWP" className="mb-3">
                <Form.Control placeholder='-' name="npwp" value={formData.npwp} onChange={handleChange} />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="NIB" className="mb-3">
                <Form.Control placeholder='-' name="nib" value={formData.nib} onChange={handleChange} />
              </FloatingLabel>
            </Col>
          </div>

          <div className='row'>
            <Col>
              <FloatingLabel label="Alamat" className="mb-3">
                <Form.Control placeholder='-' name="alamat" value={formData.alamat} onChange={handleChange} />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel label="Tanggal Pendaftaran" className="mb-3">
                <Form.Control placeholder='-' name="tanggal_pendaftaran" type="date" value={formData.tanggal_pendaftaran} onChange={handleChange} />
              </FloatingLabel>
            </Col>
          </div>

          <div className='row'>

          </div>
          
          {/* <FloatingLabel label="Nama Perusahaan" className="mb-3">
            <Form.Control name="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} required />
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
          </FloatingLabel> */}

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
              options={filteredSubKlasifikasiOptions.filter(
                (opt) => !formData.sub_klasifikasi_ids.includes(opt.value)
              )}
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
