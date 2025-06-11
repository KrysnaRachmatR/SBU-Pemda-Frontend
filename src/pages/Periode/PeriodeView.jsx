import { useEffect, useState } from 'react';
import { fetchSertifikat } from './periodeController';
import { Modal, FloatingLabel, Form, Button } from 'react-bootstrap';
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

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);

  const handleSaveAdd = () => {
    confirm({
      message: 'Apakah kamu yakin ingin menyimpan data ini?',
      onYes: () => {
        handleCloseAdd()
      },
      onNo: () => {
        console.log('Batal simpan');
      }
    });
  };

  const handleSaveEdit = () => {
    confirm({
      message: 'Apakah kamu yakin ingin menyimpan data ini?',
      onYes: () => {
        handleCloseEdit()
      },
      onNo: () => {
        console.log('Batal simpan');
      }
    });
  };

  function parseDateDMY(dateStr) {
    const [day, month, year] = dateStr.split('-');
    // bulan di JS Date dimulai dari 0 (Januari = 0)
    return new Date(year, month - 1, day);
  }


  const options = {
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

  useEffect(() => {
    fetchSertifikat(setChartData, setTableData);
  }, []);

  return (
    <>
      <div className="mb-4 w-100 d-flex justify-content-end align-items-center gap-3">
        <button className="btn tool-btn btn-sm btn-primary"><i className="bi bi-info-lg"></i></button>
        <button className="btn tool-btn btn-sm btn-outline-primary" onClick={handleShowEdit}><i className="bi bi-pencil"></i></button>
        <button className="btn tool-btn btn-sm btn-primary" onClick={handleShowAdd}>+</button>
      </div>
      <div className="row">
        {/* Chart Doughnut */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header text-center fw-bold">Subklasifikasi</div>
            <div className="card-body">
              <div className='chart-wrapper'>
                {chartData?.datasets ? (
                  <Doughnut data={chartData} options={options} />
                ) : (
                  <p>Memuat grafik...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="col-md-8">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nama Pelaku Usaha</th>
                <th>Masa Berlaku SBU</th>
              </tr>
            </thead>
            <tbody>
              {/* {tableData.map((item, index) => (
                <tr key={index}>
                  <td>{item.nama}</td>
                  <td>{item.date}</td>
                </tr>
              ))} */}
              {tableData.map((item, index) => {
                const now = new Date();
                const itemDate = parseDateDMY(item.date);
                const isExpired = itemDate <= now;

                return (
                  <tr
                    key={index}
                    className={isExpired ? 'tr-danger' : ''}
                  >
                    <td>{item.nama}</td>
                    <td>{item.date}</td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showAdd} onHide={handleCloseAdd} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Masa berlaku SBU</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <FloatingLabel
            controlId="floatingInput"
            label="Nama Pelaku Usaha"
            className="mb-3"
          >
            <Form.Control type="text" placeholder="m" />
          </FloatingLabel>
          
          <FloatingLabel
            controlId="floatingInput"
            label="NPWP"
            className="mb-3"
          >
            <Form.Control type="text" placeholder="m" />
          </FloatingLabel>
          
          <FloatingLabel
            controlId="floatingInput"
            label="NIB"
            className="mb-3"
          >
            <Form.Control type="text" placeholder="m" />
          </FloatingLabel>
          
          <FloatingLabel
            controlId="floatingInput"
            label="Kota / Kabupaten"
            className="mb-3"
          >
            <Form.Control type="text" placeholder="m" />
          </FloatingLabel>
          
          <FloatingLabel
            controlId="floatingInput"
            label="Subklasifikasi"
            className="mb-3"
          >
            <Form.Control type="text" placeholder="m" />
          </FloatingLabel>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary me-auto" onClick={handleCloseAdd}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSaveAdd}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Masa berlaku SBU</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <FloatingLabel
            controlId="floatingInput"
            label="Nama Pelaku Usaha"
            className="mb-3"
          >
            <Form.Control type="text" placeholder="m" />
          </FloatingLabel>
          
          <FloatingLabel
            controlId="floatingInput"
            label="Masa berlaku SBU"
            className="mb-3"
          >
            <Form.Control type="date" placeholder="06/07/2005" />
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
