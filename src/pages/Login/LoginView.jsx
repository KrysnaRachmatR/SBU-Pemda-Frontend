import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './loginController';

import { FloatingLabel, Form } from 'react-bootstrap';

const LoginView = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) {
      navigate('/');
    } else {
      alert('Login gagal');
    }
  };

  return (
    <div className="login-con d-flex flex-column justify-content-center align-items-center" style={{height:"100dvh", backgroundImage: 'url("/bg-login.png")'}}>
        <div className='login-logo d-flex align-items-center'>
        <img src="/logo.png" alt="Logo" />
        <p>
          PEMERINTAH <br/> KABUPATEN SAMBAS
        </p>
      </div>

      <div className="login-box">
        <h2 className='text-center fw-bold mb-0'>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" name="username" placeholder="Username" onChange={handleChange} />
          <input className="form-control mb-2" name="password" type="password" placeholder="Password" onChange={handleChange} />
          <button className="btn">Login Now</button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
