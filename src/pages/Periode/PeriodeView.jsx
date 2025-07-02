import { useEffect, useState } from 'react';
import {
  fetchSertifikat,
  fetchAnggotaStatus,
  fetchPeriode,
  fetchAllAnggota, // ✅ Tambahkan ini
  fetchAnggotaSubKlasifikasiList, // ✅ Tambahkan ini juga
} from './periodeController';

import { Modal, FloatingLabel, Form, Button, Pagination, InputGroup, FormControl } from 'react-bootstrap';
import { useConfirm } from '../../components/ConfirmProvider';

import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PeriodeView = () => {
  const { confirm } = useConfirm();

  const [chartData, setChartData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [anggotaList, setAnggotaList] = useState([]);
  const [subKlasifikasiList, setSubKlasifikasiList] = useState([]);
  const [selectedAnggotaId, setSelectedAnggotaId] = useState('');

  const [querySearch, setQuery] = useState('');

  const [formData, setFormData] = useState({
    anggota_id: '',
    sub_klasifikasi_id: '',
    tanggal_pendaftaran: '',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnggotaChange = async (e) => {
    const anggotaId = e.target.value;
    setSelectedAnggotaId(anggotaId);
    setFormData((prev) => ({ ...prev, anggota_id: anggotaId }));

    const list = await fetchAnggotaSubKlasifikasiList(anggotaId);
    setSubKlasifikasiList(list);
    };

  const handleSaveAdd = () => {
    confirm({
      message: 'Apakah kamu yakin ingin menyimpan data ini?',
      onYes: async () => {
        const { anggota_id, ...payload } = formData;

        if (!anggota_id || !payload.sub_klasifikasi_id || !payload.tanggal_pendaftaran) {
          alert('Semua kolom wajib diisi.');
          return;
        }

        const result = await fetchPeriode(anggota_id, payload, setShowAdd);

        if (result.success) {
          fetchAnggotaStatus(setTableData);
        } else {
          console.error('Gagal:', result.message);
          alert(result.message);
        }
      },
      onNo: () => console.log('Batal simpan'),
    });
  };

  const handleSaveEdit = () => {
    confirm({
      message: 'Apakah kamu yakin ingin menyimpan data ini?',
      onYes: () => handleCloseEdit(),
      onNo: () => console.log('Batal simpan'),
    });
  };

  const options = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${value} (${percentage}%)`;
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
      },
      legend: {
        position: 'bottom',
      },
    },
  };

  const parseDateDMY = (dateStr) => {
  if (!dateStr) return '-';
  const [day, month, year] = dateStr.split('-');
  return new Date(year, month - 1, day);
};


  useEffect(() => {
    fetchSertifikat(setChartData);
    fetchAnggotaStatus(setTableData);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const anggota = await fetchAllAnggota();
      setAnggotaList(anggota);
    };
    loadData();
  }, []);

  // client side search 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = tableData.filter(item =>
    item.nama.toLowerCase().includes(querySearch.toLowerCase())
  );
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  return (
    <>
      <div className="mb-4 w-100 d-flex justify-content-end align-items-center gap-3">
        <button className="btn tool-btn btn-sm btn-primary">
          <i className="bi bi-info-lg"></i>
        </button>
        {/* <button className="btn tool-btn btn-sm btn-outline-primary" onClick={handleShowEdit}>
          <i className="bi bi-pencil"></i>
        </button> */}
        <button className="btn tool-btn btn-sm btn-primary" onClick={handleShowAdd}>
          +
        </button>
      </div>

      <div className="row">
        {/* Chart Doughnut */}
        <div className="col-md-4">
         <div
            className="card"
            style={{
              backgroundColor: "#001D31",
              color: "#ffffff",
              border: "1px solid #36434E",
            }}
          >
            <div
              className="card-header text-center fw-bold"
              style={{
                backgroundColor: "#011625",
                borderBottom: "1px solid #36434E",
                color: "#ffffff",
              }}
            >
              Status Anggota - Sub Klasifikasi
            </div>
            <div className="card-body">
              <div className="chart-wrapper">
                {chartData?.datasets &&
                chartData.datasets[0].data.reduce((a, b) => a + b, 0) > 0 ? (
                  <Doughnut data={chartData} options={options} />
                ) : (
                  <p className="text-center" style={{ color: "#ffffff" }}>
                    Tidak ada data untuk ditampilkan.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
       <div className="col-md-8">
          <div
            className="p-3 border border-bottom-0 rounded-top"
            style={{
              backgroundColor: "#011625",
              border: "1px solid #36434E",
              borderBottom: "none",
            }}
          >
            <InputGroup>
              <FormControl
                placeholder="Cari Nama Perusahaan"
                value={querySearch}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  backgroundColor: "#001D31",
                  border: "1px solid #36434E",
                  color: "#ffffff",
                }}
              />
            </InputGroup>
          </div>

         <table
            className="table table-dark table-bordered table-striped mb-0"
            style={{
              backgroundColor: "#001D31",
              color: "#ffffff",
              border: "1px solid #36434E",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#011625", color: "#ffffff" }}>
                <th>Nama Perusahaan</th>
                <th>Masa Berlaku SBU</th>
                <th>Tahun KBLI</th>
                <th>KBLI</th>
                <th>Klasifikasi</th>
                <th>Sub Klasifikasi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => {
                const now = new Date();
                const itemDate = parseDateDMY(item.date);
                const isExpired = itemDate <= now;

                const rowClass =
                  item.status?.toLowerCase().trim() === "pending"
                    ? "bg-warning text-dark"
                    : isExpired
                    ? "bg-danger text-white"
                    : "";

                return (
                  <tr key={index} className={rowClass}>
                    <td className="single-line">{item.nama}</td>
                    <td className="single-line">{item.date}</td>
                    <td>{item.tahun}</td>
                    <td>{item.kbli}</td>
                    <td className="single-line">{item.klasifikasi}</td>
                    <td>{item.subKlasifikasi}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* pagination */}
          <div className="w-100 d-flex justify-content-end mt-3">
            <Pagination className="mb-0 custom-pagination">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              />

              <Pagination.Item
                active={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                1
              </Pagination.Item>

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
                onClick={() => setCurrentPage((prev) => prev + 1)}
              />
            </Pagination>
          </div>
        </div>
      </div>

      {/* Modal Tambah */}
      <Modal
        show={showAdd}
        onHide={handleCloseAdd}
        centered
        size="md"
        dialogClassName="custom-dark-modal"
      >
        <Modal.Header closeButton closeVariant="white" className="border-0">
          <Modal.Title className="text-white">Tambah Masa Berlaku SBU</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FloatingLabel
            controlId="floatingAnggotaId"
            label="Pilih Nama Perusahaan"
            className="mb-3"
          >
            <Form.Select
              name="anggota_id"
              value={formData.anggota_id}
              onChange={handleAnggotaChange}
              style={{
                backgroundColor: "#011625",
                color: "#fff",
                border: "1px solid #ffffff",
              }}
            >
              <option value="">-- Pilih Anggota --</option>
              {anggotaList.map((anggota) => (
                <option key={anggota.id} value={anggota.id}>
                  {anggota.nama_perusahaan}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingSubKlasifikasiId"
            label="Pilih Sub Klasifikasi"
            className="mb-3"
          >
            <Form.Select
              name="sub_klasifikasi_id"
              value={formData.sub_klasifikasi_id}
              onChange={handleInputChange}
              disabled={!formData.anggota_id}
              style={{
                backgroundColor: "#011625",
                color: "#fff",
                border: "1px solid #ffffff",
              }}
            >
              <option value="">-- Pilih Sub Klasifikasi --</option>
              {subKlasifikasiList.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nama_sub_klasifikasi}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingTanggal"
            label="Tanggal Pendaftaran"
            className="mb-3"
          >
            <Form.Control
              type="date"
              name="tanggal_pendaftaran"
              value={formData.tanggal_pendaftaran}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#011625",
                color: "#fff",
                border: "1px solid #ffffff",
              }}
            />
          </FloatingLabel>
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            onClick={handleCloseAdd}
            style={{
              backgroundColor: "#36434E",
              border: "1px solid #ffffff",
              color: "#ffffff",
            }}
          >
            Tutup
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveAdd}
            style={{
              backgroundColor: "#90B6D1",
              border: "1px solid #ffffff",
              color: "#001625",
            }}
          >
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Edit (belum difungsikan penuh) */}
      <Modal show={showEdit} onHide={handleCloseEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Masa Berlaku SBU</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingNamaEdit" label="Nama Pelaku Usaha" className="mb-3">
            <Form.Control type="text" placeholder="Nama" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingTanggalEdit" label="Masa Berlaku SBU" className="mb-3">
            <Form.Control type="date" />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary me-auto" onClick={handleCloseEdit}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PeriodeView;