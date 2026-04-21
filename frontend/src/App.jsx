import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import SelectProducts from './pages/SelectProducts';
import SelectTexture from './pages/SelectTexture';
import SelectSheerTexture from './pages/SelectSheerTexture';
import OwnerPage from './pages/OwnerPage';
import AssistantPage from './pages/AssistantPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import SelectRoom from './pages/SelectRoom';
import GenerateImage from './pages/GenerateImage';
import CartPage from './pages/CartPage';
import { useTheme } from './context/ThemeContext';
import ClickSpark from './components/ui/ClickSpark';

const sharedSparkConfig = {
  sparkSize: 10,
  sparkRadius: 87,
  sparkCount: 8,
  duration: 400,
  easing: 'ease-out',
  extraScale: 1,
};

const ThemeSparkWrapper = ({ children }) => {
  const theme = useTheme();

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {children}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <ClickSpark
          sparkColor={theme.isDark ? '#ca7a02' : '#2302ca'}
          {...sharedSparkConfig}
        />
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login-page" element={<ThemeSparkWrapper><LoginPage /></ThemeSparkWrapper>} />
      <Route path="/generate-image" element={<GenerateImage />} />
      <Route path="/" element={<SelectProducts />} />
      <Route path="/select-texture" element={<ThemeSparkWrapper><SelectTexture /></ThemeSparkWrapper>} />
      <Route path="/select-sheer-texture" element={<ThemeSparkWrapper><SelectSheerTexture /></ThemeSparkWrapper>} />
      <Route path="/owner" element={<ThemeSparkWrapper><ProtectedRoute allowedRoles={['seller']}><OwnerPage /></ProtectedRoute></ThemeSparkWrapper>} />
      <Route path="/assistant" element={<ThemeSparkWrapper><ProtectedRoute allowedRoles={['assistant']}><AssistantPage /></ProtectedRoute></ThemeSparkWrapper>} />
      <Route path="/cart" element={<ThemeSparkWrapper><CartPage /></ThemeSparkWrapper>} />
      <Route path="/select-room" element={<ThemeSparkWrapper><SelectRoom /></ThemeSparkWrapper>} />
      <Route path="*" element={<ThemeSparkWrapper><NotFound /></ThemeSparkWrapper>} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;