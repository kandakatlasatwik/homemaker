import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import SelectProducts from './pages/SelectProducts';
import SelectTexture from './pages/SelectTexture';
import SelectSheerTexture from './pages/SelectSheerTexture';
import OwnerPage from './pages/OwnerPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import SelectRoom from './pages/SelectRoom';
import GenerateImage from './pages/GenerateImage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login-page" element={<LoginPage />} />   
          <Route path="/generate-image" element={<GenerateImage />} />       
          <Route path="/" element={<SelectProducts />} />
          <Route path="/select-texture" element={<SelectTexture />} />
          <Route path="/select-sheer-texture" element={<SelectSheerTexture />} />
          <Route path="/owner" element={<ProtectedRoute><OwnerPage /></ProtectedRoute>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/select-room" element={<SelectRoom />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;