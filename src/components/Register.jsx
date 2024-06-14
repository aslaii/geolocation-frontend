import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';
import { registerUser, loginUser } from '../services/api';

const Register = ({ setToken }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password });
      toast.success('Registration successful');

      const response = await loginUser({ email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        for (const key in errors) {
          if (errors[key]) {
            toast.error(errors[key][0]);
          }
        }
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
