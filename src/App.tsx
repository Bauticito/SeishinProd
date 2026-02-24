import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import CalculatorPage from './pages/CalculatorPage';
import GalleryPage from './pages/GalleryPage';
import SeishinIaPage from './pages/SeishinIaPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/seishinia" element={<SeishinIaPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
