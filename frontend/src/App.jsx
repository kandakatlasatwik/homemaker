import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SelectProducts from './pages/SelectProducts';
import SelectTexture from './pages/SelectTexture';

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<SelectProducts />} />
        <Route path="/select-texture" element={<SelectTexture />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;