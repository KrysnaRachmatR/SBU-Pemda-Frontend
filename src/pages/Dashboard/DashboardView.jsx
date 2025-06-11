import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { fetchDashboardData } from './dashboardController';

const DashboardView = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchDashboardData();
      setData(result);
    };
    loadData();
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-header fw-bold">Sertifikat Badan Usaha</div>
        <div className="card-body">
          <div className="category-title bg-light rounded-3 border-3 border p-3 fw-bold">
            Klasifikasi
          </div>
          <div className="category-con">
            <div className="company-category">
              Kontruksi
            </div>
            <div className="company-category">
              <i className="bi bi-plus-lg"></i>
            </div>
            <div className="company-category">
              <i className="bi bi-plus-lg"></i>
            </div>
            <div className="company-category">
              <i className="bi bi-plus-lg"></i>
            </div>
            <div className="company-category">
              <i className="bi bi-plus-lg"></i>
            </div>
            <div className="company-category">
              <i className="bi bi-plus-lg"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardView;
