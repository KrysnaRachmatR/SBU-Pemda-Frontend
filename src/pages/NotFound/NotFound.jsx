import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">404</h1>
      <p className="lead">Halaman tidak ditemukan</p>
      <Link to="/" className="btn btn-primary">Kembali ke Dashboard</Link>
    </div>
  );
};

export default NotFound;
