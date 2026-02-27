import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SelectProducts from './pages/SelectProducts';
import SelectTexture from './pages/SelectTexture';
import SelectColor from './pages/SelectColor';
import OwnerPage from './pages/OwnerPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login-page" element={<LoginPage />} />       
        <Route path="/" element={<SelectProducts />} />
        <Route path="/select-texture" element={<SelectTexture />} />
        <Route path="/select-color" element={<SelectColor />} />
        <Route path="/owner" element={<ProtectedRoute><OwnerPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;