import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import LoginSuccess from './LoginSuccess';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login-success" element={<LoginSuccess />} />
      </Routes>
    </Router>
  );
};

export default App;
