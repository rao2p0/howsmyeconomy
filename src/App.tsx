import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Disclaimer } from './pages/Disclaimer';
import { CategoryDetail } from './pages/CategoryDetail';
import { Footer } from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/category/:categoryId" element={<CategoryDetail />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;