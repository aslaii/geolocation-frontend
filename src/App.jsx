import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleSetToken = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login setToken={handleSetToken} />} />
          <Route path="/register" element={token ? <Navigate to="/" /> : <Register setToken={handleSetToken} />} />
          <Route path="/" element={token ? <Home token={token} setToken={handleSetToken} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
