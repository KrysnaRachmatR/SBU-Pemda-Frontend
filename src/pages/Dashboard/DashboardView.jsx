import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { fetchDashboardData, saveKlasifikasi } from './dashboardController';

const DashboardView = () => {
  const [data, setData] = useState([]);
  const [newKlasifikasi, setNewKlasifikasi] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const result = await fetchDashboardData();
    setData(result);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddKlasifikasi = async (e) => {
    e.preventDefault();
    if (!newKlasifikasi.trim()) return;

    try {
      setLoading(true);
      await saveKlasifikasi(newKlasifikasi);
      setNewKlasifikasi('');
      await loadData(); // refresh data setelah tambah
    } catch (err) {
      alert('Gagal menambahkan klasifikasi');
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleAddKlasifikasi} className="mb-3 d-flex gap-2">
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
          </form>

          {/* Tampilkan semua klasifikasi */}
          <div className="category-con d-flex flex-wrap gap-2 mt-3">
            {data.map((item) => (
              <div key={item.id} className="company-category border p-2 rounded">
                {item.nama}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardView;
