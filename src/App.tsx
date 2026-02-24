import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import CalculatorPage from './pages/CalculatorPage';
import GalleryPage from './pages/GalleryPage';
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
