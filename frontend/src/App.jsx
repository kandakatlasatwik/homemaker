import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SelectProducts from './pages/SelectProducts';
import SelectTexture from './pages/SelectTexture';
import OwnerPage from './pages/OwnerPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import SofaRoom from './pages/SofaRoom';

import bgVideo from './assets/videos/background.mp4';

function App() {
  return (
    <BrowserRouter>

      {/* Global Background Video */}
      <video autoPlay loop muted playsInline style={styles.video}>
        <source src={bgVideo} type="video/mp4" />
      </video>

      <Routes>
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/" element={<SelectProducts />} />
        <Route path="/select-texture" element={<SelectTexture />} />
        <Route path="/owner" element={<ProtectedRoute><OwnerPage /></ProtectedRoute>} />
        <Route path="/sofa-room" element={<SofaRoom />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  );
}

const styles = {
  video: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1
  }
};

export default App;