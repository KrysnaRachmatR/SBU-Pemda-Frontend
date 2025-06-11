import { useEffect, useState } from 'react';
import { fetchSertifikat } from './sertifikatController';
import { Modal, FloatingLabel, Form, Button, Pagination, Row, Col} from 'react-bootstrap';
import { useConfirm } from '../../components/ConfirmProvider';

import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SertifikatView = () => {
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
                <th>KBLI</th>
                <th style={{whiteSpace:"no-wrap"}} className='nowrap'>Nama Usaha</th>
                <th>NPWP</th>
                <th>NIB</th>
                <th>Kabupaten/Kota</th>
                <th>Subklasifikasi</th>
                <th>Alamat</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index}>
                  <td>{item.KBLI}</td>
                  <td>{item.name}</td>
                  <td>{item.NPWP}</td>
                  <td>{item.NIB}</td>
                  <td>{item.Kota}</td>
                  <td>{item.Subklasifikasi}</td>
                  <td style={{maxWidth:"350px"}}>{item.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-100 d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev />
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Ellipsis />
              <Pagination.Item>{6}</Pagination.Item>
              <Pagination.Item>{7}</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </div>
      </div>



      <Modal show={showAdd} onHide={handleCloseAdd} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tambah Subklasifikasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="KBLI"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="Nama Pelaku Usaha"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
          </Row>

          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="NPWP"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="NIB"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="Kota / Kabupaten"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="Subklasifikasi"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
          </Row>

          <FloatingLabel controlId="floatingTextarea2" label="Alamat">
            <Form.Control
              as="textarea"
              placeholder="a"
              style={{ height: '100px' }}
            />
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

      <Modal show={showEdit} onHide={handleCloseEdit} centered size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subklasifikasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="KBLI"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="Nama Pelaku Usaha"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
          </Row>

          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="NPWP"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="NIB"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="Kota / Kabupaten"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingInput"
                label="Subklasifikasi"
                className="mb-3"
              >
                <Form.Control type="text" placeholder="m" />
              </FloatingLabel>
            </Col>
          </Row>

          <FloatingLabel controlId="floatingTextarea2" label="Alamat">
            <Form.Control
              as="textarea"
              placeholder="a"
              style={{ height: '100px' }}
            />
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

export default SertifikatView;
