import { NavLink, useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className='w-100 d-flex justify-content-center' style={{ backgroundColor: "#011625" }}>
      <nav className="navbar navbar-expand-lg navbar-dark px-4" style={{ backgroundColor: "#011625" }}>
        <NavLink className="navbar-brand d-flex align-items-center" to="/"style={{ backgroundColor: "#011625" }}>
          <img src="/logo.png" alt="Logo" />
          <div>
            <p className='d-block'>PEMERINTAH <br/> KABUPATEN SAMBAS</p>
          </div>
        </NavLink>
        <div className="collapse navbar-collapse" style={{ backgroundColor: "#011625" }}>
          <ul className="navbar-nav ms-auto me-auto gap-4" style={{ backgroundColor: "#011625" }}>
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Klasifikasi
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sbu">
                SBU
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/periode">
                Masa Berlaku SBU
              </NavLink>
            </li>
          </ul>
          <button onClick={handleLogout} className="btn rounded-1 btn-outline-dark">Log Out</button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
