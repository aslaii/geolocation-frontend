import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToast } from '../store/toastSlice';
import './Login.css';
import { loginUser } from '../services/api';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      dispatch(addToast({ type: 'success', message: 'Login successful' }));
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        dispatch(addToast({ type: 'error', message: 'Login failed. Please check your email and password.' }));
      } else {
        dispatch(addToast({ type: 'error', message: 'An error occurred. Please try again.' }));
      }
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        <Link to="/register" className="register-button">Register</Link>
      </form>
    </div>
  );
};

export default Login;
