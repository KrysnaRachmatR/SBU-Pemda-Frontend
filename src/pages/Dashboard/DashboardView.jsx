import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Spinner } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import { fetchDashboardData, saveKlasifikasi } from './dashboardController';

const DashboardView = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [newKlasifikasi, setNewKlasifikasi] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const loadData = async () => {
    const result = await fetchDashboardData();
    setData(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  const hanldeFilter = (value) => {
    if (value) {
      navigate(`/sbu?filter=${encodeURIComponent(value)}`);
    }
  }

  const handleAddKlasifikasi = async () => {
    if (!newKlasifikasi.trim()) return;

    try {
      setLoading(true);
      await saveKlasifikasi(newKlasifikasi);
      
      setShowInput(false);
      setNewKlasifikasi('');
      
      await loadData(); // refresh data setelah tambah

      setLoading(false);
    } catch (err) {
      alert('Gagal menambahkan klasifikasi');
      setLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setShowInput(false);
    setNewKlasifikasi('');
  };

  return (
    <>
      <div className="card">
        <div className="card-header fw-bold">Sertifikat Badan Usaha</div>
        <div className="card-body">
          <div className="category-title bg-light rounded-3 border-3 border p-3 fw-bold">
            Klasifikasi
          </div>

          {/* Form tambah klasifikasi */}
          {/* <form onSubmit={handleAddKlasifikasi} className="mb-3 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Masukkan klasifikasi baru"
              value={newKlasifikasi}
              onChange={(e) => setNewKlasifikasi(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Tambah'}
            </button>
          </form> */}

          {/* Tampilkan semua klasifikasi */}
          <div className="category-con d-flex flex-wrap gap-2 mt-3">
            {data.map((item) => (
              <div key={item.id} className="company-category" onClick={() => hanldeFilter(item.nama)}>
                {item.nama}
              </div>
            ))}
            {/* <div className="company-category">
              <i className="bi bi-plus-lg"></i>
            </div> */}
            <div className={`company-category ${showInput ? 'active' : ''}`} onClick={() => setShowInput(true)} style={{ cursor: 'pointer' }}>
              {!showInput ? (
                  <i className="bi bi-plus-lg"></i>
              ) : (
                <div>
                  <Form.Control
                    type="text"
                    placeholder="Klasifikasi Baru"
                    value={newKlasifikasi}
                    onChange={(e) => setNewKlasifikasi(e.target.value)}
                    className='w-100 px-1'
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #ccc',
                      borderRadius: 0,
                      boxShadow: 'none',
                      outline: 'none',
                      width: '200px',
                    }}
                  />
                  <div className='mt-2 d-flex justify-content-center'>
                    <Button
                      disabled={loading}
                      variant="outline-danger me-2"
                      style={{
                        width: '38px',
                        height: '28px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelAdd();
                      }}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                    <Button
                      disabled={loading}
                      variant="outline-success"
                      style={{
                        width: '38px',
                        height: '28px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddKlasifikasi();
                      }}
                    >
                      {loading ? (
                        <Spinner animation="border" role="status" style={{width:'1rem', height:'1rem'}}>
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ): (
                        <i className="bi bi-check-lg"></i>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardView;
