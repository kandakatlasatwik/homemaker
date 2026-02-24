import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SelectProducts from './pages/SelectProducts';
import SelectTexture from './pages/SelectTexture';
import SelectColor from './pages/SelectColor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<SelectProducts />} />
        <Route path="/select-texture" element={<SelectTexture />} />
        <Route path="/select-color" element={<SelectColor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;