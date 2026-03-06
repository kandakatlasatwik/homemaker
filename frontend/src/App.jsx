import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SelectProducts from './pages/SelectProducts';
import SelectTexture from './pages/SelectTexture';
import OwnerPage from './pages/OwnerPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import SofaRoom from './pages/SofaRoom';
import GenerateImage from './pages/GenerateImage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login-page" element={<LoginPage />} />   
        <Route path="/generate-image" element={<GenerateImage />} />       
        <Route path="/" element={<SelectProducts />} />
        <Route path="/select-texture" element={<SelectTexture />} />
        <Route path="/owner" element={<ProtectedRoute><OwnerPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route path="sofa-room" element={<SofaRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;