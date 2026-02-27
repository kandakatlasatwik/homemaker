import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SelectProducts from './pages/SelectProducts';
import SelectTexture from './pages/SelectTexture';
import SelectColor from './pages/SelectColor';
import OwnerPage from './pages/OwnerPage';
import DisplayImage from './pages/DisplayImage';
import SampleGenerate from './pages/SampleGenerate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/display-image" element={<DisplayImage />} />
        <Route path="/sample-generate" element={<SampleGenerate />} />
        <Route path="/" element={<SelectProducts />} />
        <Route path="/select-texture" element={<SelectTexture />} />
        <Route path="/select-color" element={<SelectColor />} />
        <Route path="/owner" element={<OwnerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;