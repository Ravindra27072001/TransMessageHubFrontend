import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegistrationForm from './Components/RegistrationForm';
import LoginForm from './Components/LoginForm';
import ManufacturerDashboard from './Components/ManufacturerDashboard';
import TransporterDashboard from './Components/TransporterDashboard';


const App = () => {
  return (
      <BrowserRouter>
      <ToastContainer />
        <Routes>
          <Route path="/register" element={<RegistrationForm/>} />
          <Route path="/" element={<LoginForm/>} />
          <Route path="/manufacturer-dashboard" element={<ManufacturerDashboard/>} />
          <Route path="/transporter-dashboard" element={<TransporterDashboard/>} />
        
        </Routes>
      </BrowserRouter>
  );
};

export default App;
