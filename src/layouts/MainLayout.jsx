import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const { pathname } = useLocation();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <div className="container-fluid mt-1 px-0" style={{ backgroundColor: "#011625" }}>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
