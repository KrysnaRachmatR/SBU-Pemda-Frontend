// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginView from '../pages/Login/LoginView';
// import DashboardView from '../pages/Dashboard/DashboardView';
// // import PeriodeView from '../pages/Klasifikasi/PeriodeView';
// // import SertifikatView from '../pages/Sertifikat/SertifikatView';
// import NotFound from '../pages/NotFound/NotFound';
// import PrivateRoute from './PrivateRoute';
// import MainLayout from '../layouts/MainLayout';

// const AppRouter = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginView />} />

//         {/* Protected Routes */}
//         <Route element={<PrivateRoute />}>
//           <Route element={<MainLayout />}>
//             <Route path="/" element={<DashboardView />} />
//             {/* <Route path="/klasifikasi" element={<PeriodeView />} />
//             <Route path="/sertifikat" element={<SertifikatView />} /> */}
//             <Route path="*" element={<NotFound />} />
//           </Route>
//         </Route>
//       </Routes>
//     </Router>
//   );
// };

// export default AppRouter;




import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import LoginView from '../pages/Login/LoginView';
import DashboardView from '../pages/Dashboard/DashboardView';
import PeriodeView from '../pages/periode/PeriodeView';
import SertifikatView from '../pages/Sertifikat/SertifikatView';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../layouts/MainLayout';
import NotFound from '../pages/NotFound/NotFound';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Login (tanpa layout & tanpa proteksi) */}
        <Route path="/login" element={<LoginView />} />

        {/* Proteksi dan layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<DashboardView />} />
            <Route path="/periode" element={<PeriodeView />} />
            <Route path="/sbu" element={<SertifikatView />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
