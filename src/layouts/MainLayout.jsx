import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  const { pathname } = useLocation();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <div className="container-fluid mt-4">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
