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
      <div className="card" style={{ backgroundColor: "#001D31", color: "#ffffff", border: "1px solid #36434E" }}>
       <div className="card-header fw-bold text-center" style={{ backgroundColor: "#011625", borderBottom: "1px solid #36434E", color: "#ffffff" }}>Sertifikat Badan Usaha</div>
         <div className="card-body">
          <div
            className="category-title rounded-3 border p-3 fw-bold"
            style={{
              backgroundColor: "#011625",
              border: "1px solid #36434E",
              color: "#ffffff",
            }}
          >
            Klasifikasi
          </div>

          {/* Tampilkan semua klasifikasi */}
          <div className="category-con d-flex flex-wrap gap-2 mt-3">
            {data.map((item, index) => {
              const bgIndex = (index % 5) + 1; // pakai 5 gambar bg1.png - bg5.png
              const bgImage = `/assets/klasifikasi/bg${bgIndex}.png`;

              return (
                <div
                  key={item.id}
                  className="company-category position-relative overflow-hidden"
                  onClick={() => hanldeFilter(item.nama)}
                  style={{
                    border: "1px solid rgb(255, 255, 255)",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    color: "#ffffff",
                    backgroundColor: "transparent",
                  }}
                >
                  {/* Background image */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(2px)",
                      opacity: 0.25,
                      zIndex: -2,
                      // borderRadius: "8px",
                    }}
                  />

                  {/* Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.3)",
                      zIndex: -1,
                      // borderRadius: "8px",
                    }}
                  />

                  {/* Text */}
                  <span style={{ position: "relative", zIndex: 1 }}>{item.nama}</span>
                </div>
              );
            })}

            {/* Input Klasifikasi Baru */}
            <div
              className={`company-category ${showInput ? "active" : ""}`}
              onClick={() => setShowInput(true)}
              style={{
                cursor: "pointer",
                backgroundColor: "#011625",
                color: "#ffffff",
                border: "1px dashed #90B6D1",
                borderRadius: "8px",
                padding: "6px 12px",
                minWidth: "42px",
                textAlign: "center",
                position: "relative",
              }}
            >
              {!showInput ? (
                <i className="bi bi-plus-lg"></i>
              ) : (
                <div>
                  <Form.Control
                    type="text"
                    placeholder="Klasifikasi Baru"
                    value={newKlasifikasi}
                    onChange={(e) => setNewKlasifikasi(e.target.value)}
                    className="w-100 px-1 text-white"
                    style={{
                      backgroundColor: "#001D31",
                      border: "none",
                      borderBottom: "1px solid #90B6D1",
                      borderRadius: 0,
                      boxShadow: "none",
                      outline: "none",
                      width: "200px",
                    }}
                  />
                  <div className="mt-2 d-flex justify-content-center gap-2">
                    <Button
                      disabled={loading}
                      variant="outline-danger"
                      style={{
                        width: "38px",
                        height: "28px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        borderColor: "#dc3545",
                        color: "#dc3545",
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
                        width: "38px",
                        height: "28px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        borderColor: "#198754",
                        color: "#198754",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddKlasifikasi();
                      }}
                    >
                      {loading ? (
                        <Spinner
                          animation="border"
                          role="status"
                          style={{ width: "1rem", height: "1rem" }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      ) : (
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
